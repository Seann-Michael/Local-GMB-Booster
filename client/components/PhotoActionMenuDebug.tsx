import React from 'react';
import { PhotoActionMenu } from './PhotoActionMenu';

export function PhotoActionMenuDebug() {
  const testPhoto = {
    url: 'https://picsum.photos/300/300?random=1',
    projectName: 'Test Project',
    isPrimary: false
  };

  const handleEdit = () => console.log('Edit clicked');
  const handleDelete = () => console.log('Delete clicked');  
  const handleToggleFavorite = () => console.log('Favorite clicked');
  const handleDownload = () => console.log('Download clicked');
  const handleViewDetails = () => console.log('Details clicked');

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-lg font-bold mb-4">PhotoActionMenu Test</h3>
      <div className="relative w-64 h-64 bg-gray-200 rounded">
        <img 
          src={testPhoto.url} 
          alt="Test" 
          className="w-full h-full object-cover rounded"
        />
        <div className="absolute top-2 right-2">
          <PhotoActionMenu
            photo={testPhoto}
            index={0}
            projectName={testPhoto.projectName}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onDownload={handleDownload}
            onViewDetails={handleViewDetails}
            isFavorite={testPhoto.isPrimary}
            className="h-8 w-8"
          />
        </div>
      </div>
    </div>
  );
}
