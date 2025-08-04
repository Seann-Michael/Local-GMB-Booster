import React, { useEffect, useState } from 'react';
import { mockDataService } from '@/lib/mockData';

interface ImageDebuggerProps {
  projectId?: string;
}

export function ImageDebugger({ projectId = "project-1" }: ImageDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [imageTests, setImageTests] = useState<any[]>([]);

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
    <div className="fixed top-4 right-4 bg-white p-4 border rounded shadow-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Image Debug Info</h3>
      <div className="space-y-1">
        <div>Project ID: {debugInfo.projectId}</div>
        <div>Projects in Storage: {debugInfo.projectsInStorage}</div>
        <div>Project Found: {debugInfo.projectFound ? 'Yes' : 'No'}</div>
        <div>Photos Count: {debugInfo.photosCount}</div>
        <div>Mock Service Project: {debugInfo.mockServiceProject ? 'Yes' : 'No'}</div>
        <div>Mock Service Photos: {debugInfo.mockServicePhotos}</div>
        
        {debugInfo.firstPhotoTest && (
          <>
            <hr className="my-2" />
            <div>First Photo URL: {debugInfo.firstPhotoTest.url}</div>
            <div>Is String: {debugInfo.firstPhotoTest.isString ? 'Yes' : 'No'}</div>
            <div>Image Load: {
              debugInfo.imageLoadSuccess === null ? 'Testing...' :
              debugInfo.imageLoadSuccess ? 'Success' : 'Failed'
            }</div>
            {debugInfo.imageError && <div className="text-red-500">Error: {debugInfo.imageError}</div>}
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
