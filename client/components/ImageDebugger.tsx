import React, { useEffect, useState } from 'react';
import { mockDataService } from '@/lib/mockData';

interface ImageDebuggerProps {
  projectId?: string;
}

export function ImageDebugger({ projectId = "project-1" }: ImageDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [imageTests, setImageTests] = useState<any[]>([]);

  const forceReinitialize = () => {
    // Clear localStorage and reinitialize
    localStorage.removeItem('projects');
    localStorage.removeItem('users');
    localStorage.removeItem('clients');
    mockDataService.initialize();
    window.location.reload(); // Reload to see fresh data
  };

  useEffect(() => {
    // Force initialize mock data service
    try {
      mockDataService.initialize();
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }

    // Check localStorage directly
    const projectsFromStorage = localStorage.getItem('projects');
    const projectsArray = projectsFromStorage ? JSON.parse(projectsFromStorage) : [];

    // Check specific project
    const project = projectsArray.find((p: any) => p.id === projectId);

    // Get project from mock service
    const mockProject = mockDataService.getProject(projectId);

    // Test multiple image URLs
    const imageTests: any[] = [];
    if (project?.photos?.length > 0) {
      const photosToTest = project.photos.slice(0, 3); // Test first 3 photos

      photosToTest.forEach((photo: any, index: number) => {
        const photoUrl = typeof photo === 'string' ? photo : photo.url;
        const testResult = {
          index,
          url: photoUrl,
          isString: typeof photo === 'string',
          loadSuccess: null as boolean | null,
          error: null as string | null
        };

        imageTests.push(testResult);

        // Create test image to check if URL loads
        const testImg = new Image();
        testImg.onload = () => {
          setImageTests(prev => prev.map(test =>
            test.index === index ? { ...test, loadSuccess: true } : test
          ));
        };
        testImg.onerror = (e) => {
          setImageTests(prev => prev.map(test =>
            test.index === index ? {
              ...test,
              loadSuccess: false,
              error: 'Network error or invalid URL'
            } : test
          ));
        };
        testImg.src = photoUrl;
      });
    }

    setImageTests(imageTests);

    setDebugInfo({
      projectId,
      projectsInStorage: projectsArray.length,
      projectFound: !!project,
      photosCount: project?.photos?.length || 0,
      mockServiceProject: !!mockProject,
      mockServicePhotos: mockProject?.photos?.length || 0,
      mockDataInitialized: localStorage.getItem('projects') !== null,
      storageProject: project ? {
        id: project.id,
        name: project.name,
        photosStructure: project.photos?.slice(0, 2) // First 2 photos for debugging
      } : null
    });
  }, [projectId]);

  if (!debugInfo) return <div>Loading debug info...</div>;

  return (
    <div className="fixed top-4 right-4 bg-white p-4 border rounded shadow-lg text-xs max-w-sm z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Image Debug Info</h3>
      <div className="space-y-1">
        <div>Project ID: {debugInfo.projectId}</div>
        <div>Projects in Storage: {debugInfo.projectsInStorage}</div>
        <div>Project Found: {debugInfo.projectFound ? 'Yes' : 'No'}</div>
        <div>Photos Count: {debugInfo.photosCount}</div>
        <div>Mock Service Project: {debugInfo.mockServiceProject ? 'Yes' : 'No'}</div>
        <div>Mock Service Photos: {debugInfo.mockServicePhotos}</div>
        <div>Mock Data Initialized: {debugInfo.mockDataInitialized ? 'Yes' : 'No'}</div>

        {imageTests.length > 0 && (
          <>
            <hr className="my-2" />
            <div className="font-semibold">Image Load Tests:</div>
            {imageTests.map((test, i) => (
              <div key={i} className="border-l-2 pl-2 ml-2 mb-2">
                <div>Photo {test.index + 1}</div>
                <div className="text-xs text-gray-600 break-all">{test.url}</div>
                <div>Type: {test.isString ? 'String' : 'Object'}</div>
                <div>Status: {
                  test.loadSuccess === null ? 'Testing...' :
                  test.loadSuccess ? '✅ Success' : '❌ Failed'
                }</div>
                {test.error && <div className="text-red-500">{test.error}</div>}
              </div>
            ))}
          </>
        )}

        {debugInfo.storageProject && (
          <>
            <hr className="my-2" />
            <div>Project: {debugInfo.storageProject.name}</div>
            <div>Photos Structure:</div>
            <pre className="text-xs bg-gray-100 p-1 rounded">
              {JSON.stringify(debugInfo.storageProject.photosStructure, null, 2)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
