const fs = require("fs");
const path = require("path");

const agencyPages = [
  "AgencyBusinessOwners.tsx",
  "AgencyAdminUsers.tsx",
  "AgencyCommission.tsx",
  "AgencyAnalytics.tsx",
  "AgencyReports.tsx",
  "AgencyBilling.tsx",
  "AgencySettings.tsx",
  "AgencyClientManagement.tsx",
  "AddAgencyClient.tsx",
  "AddAgencyAdminUser.tsx",
  "AgencyBusinessOwnerDetail.tsx",
  "AgencyBusinessOwnerEdit.tsx",
  "AgencyAdminUserDetail.tsx",
  "AgencyAdminUserEdit.tsx",
];

const pagesDir = "./client/pages";

agencyPages.forEach((fileName) => {
  const filePath = path.join(pagesDir, fileName);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace import
    content = content.replace(
      /import { AgencyAdminLayout } from "@\/components\/AgencyAdminLayout";/g,
      'import { AgencyLayout } from "@/components/AgencyLayout";',
    );

    // Replace opening tag
    content = content.replace(/<AgencyAdminLayout>/g, "<AgencyLayout>");

    // Replace closing tag
    content = content.replace(/<\/AgencyAdminLayout>/g, "</AgencyLayout>");

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${fileName}`);
  } else {
    console.log(`File not found: ${fileName}`);
  }
});

console.log("Agency layout updates complete!");
