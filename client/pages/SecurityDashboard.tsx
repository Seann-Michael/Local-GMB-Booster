import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppLayout } from "@/components/AppLayout";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Key,
  Eye,
  Lock,
  Smartphone,
  Clock,
  Activity,
  UserCheck,
  Ban,
  Wifi,
  Download,
  RefreshCw,
  Settings,
  Bell,
  FileText,
  Monitor,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  AuditLogger,
  SecurityMonitor,
  SecureSession,
  CSRFProtection,
  DataProtection,
} from "@/lib/security";
import { toast } from "sonner";

export default function SecurityDashboard() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [mfaSetupOpen, setMfaSetupOpen] = useState(false);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = () => {
    setSecurityEvents(SecurityMonitor.getSecurityEvents());
    setAuditLogs(AuditLogger.getAuditLogs());
  };

  const getSecurityScore = () => {
    let score = 60; // Base score

    if (auth.user?.mfaEnabled) score += 20;
    if (auth.getSecurityInfo().sessionValid) score += 10;
    if (CSRFProtection.getToken()) score += 5;
    if (auth.user?.lastLogin) score += 5;

    return Math.min(100, score);
  };

  const getSecurityStatus = () => {
    const score = getSecurityScore();
    if (score >= 90)
      return {
        status: "excellent",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (score >= 75)
      return { status: "good", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 60)
      return { status: "fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { status: "poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await auth.changePassword(currentPassword, newPassword);
      setPasswordChangeOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEnableMFA = async () => {
    try {
      const result = await auth.enableMFA();
      // Show QR code and backup codes
      toast.success("MFA enabled successfully");
      setMfaSetupOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getEventSeverity = (type: string) => {
    const critical = [
      "MULTIPLE_FAILED_LOGINS",
      "XSS_ATTEMPT",
      "UNAUTHORIZED_ACCESS_ATTEMPT",
    ];
    const warning = ["FAILED_LOGIN_ATTEMPT", "CSRF_TOKEN_MISMATCH"];

    if (critical.includes(type)) return "critical";
    if (warning.includes(type)) return "warning";
    return "info";
  };

  const getEventColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  const securityStatus = getSecurityStatus();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Security Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage your account security
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSecurityData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Security Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Security</span>
                  <span
                    className={`text-sm font-medium ${securityStatus.color}`}
                  >
                    {getSecurityScore()}/100
                  </span>
                </div>
                <Progress value={getSecurityScore()} className="h-2" />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${securityStatus.bg} ${securityStatus.color}`}
              >
                {securityStatus.status.toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        {securityEvents.filter((e) => getEventSeverity(e.type) === "critical")
          .length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Security Alert</AlertTitle>
            <AlertDescription className="text-red-700">
              Critical security events detected. Please review the Security
              Events tab immediately.
            </AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Session Status
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {auth.isAuthenticated ? "Active" : "Inactive"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {auth.sessionWarning
                      ? `Expires in ${Math.ceil(auth.timeUntilExpiry / 60000)}min`
                      : "Secure session"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    MFA Status
                  </CardTitle>
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {auth.user?.mfaEnabled ? "Enabled" : "Disabled"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Two-factor authentication
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Failed Attempts
                  </CardTitle>
                  <Ban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{auth.loginAttempts}</div>
                  <p className="text-xs text-muted-foreground">
                    {auth.isLocked ? "Account locked" : "Recent failures"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Last Login
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {auth.user?.lastLogin
                      ? new Date(auth.user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Previous session
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!auth.user?.mfaEnabled && (
                  <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">
                          Enable Two-Factor Authentication
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setMfaSetupOpen(true)}>
                      Enable MFA
                    </Button>
                  </div>
                )}

                {auth.sessionWarning && (
                  <div className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium">Session Expiring Soon</div>
                        <div className="text-sm text-muted-foreground">
                          Your session will expire in{" "}
                          {Math.ceil(auth.timeUntilExpiry / 60000)} minutes
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={auth.extendSession}>
                      Extend Session
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Strong Password Policy</div>
                      <div className="text-sm text-muted-foreground">
                        Regular password changes recommended
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPasswordChangeOpen(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.slice(0, 10).map((event, index) => {
                      const severity = getEventSeverity(event.type);
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-sm">
                            {new Date(event.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {event.type.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                severity === "critical"
                                  ? "destructive"
                                  : severity === "warning"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {JSON.stringify(event.details).substring(0, 50)}...
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.slice(0, 15).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.action}
                        </TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.userId || "System"}</TableCell>
                        <TableCell className="text-sm">
                          {log.ipAddress}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add extra security with MFA
                      </p>
                    </div>
                    <Switch
                      checked={auth.user?.mfaEnabled}
                      onCheckedChange={() => setMfaSetupOpen(true)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Remember Login</Label>
                      <p className="text-sm text-muted-foreground">
                        Stay logged in for 7 days
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setPasswordChangeOpen(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Activity Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Track user actions for security
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Monitoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor for suspicious activity
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive data locally
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
        <Dialog open={passwordChangeOpen} onOpenChange={setPasswordChangeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Choose a strong password to keep your account secure
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPasswordChangeOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange}>Update Password</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* MFA Setup Dialog */}
        <Dialog open={mfaSetupOpen} onOpenChange={setMfaSetupOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                {/* QR Code would go here */}
                <div className="w-48 h-48 bg-muted mx-auto flex items-center justify-center">
                  QR Code Placeholder
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mfa-code">Verification Code</Label>
                <Input
                  id="mfa-code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setMfaSetupOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEnableMFA}>Enable MFA</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
