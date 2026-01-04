import React, { useState, useMemo } from 'react';
import FileExplorer, { Folder, Document } from './components/FileExplorer';
import { Home } from 'lucide-react';

// Mock Data
const INITIAL_FOLDERS = [
  { id: '1', name: 'Work Documents', parentId: undefined },
  { id: '2', name: 'Personal', parentId: undefined },
  { id: '3', name: 'Projects', parentId: '1' },
  { id: '4', name: 'Finances', parentId: '2' },
  { id: '5', name: '2024 Plans', parentId: '3' },
];

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    title: 'Q4 Report',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: '1',
    version: 1,
    type: 'word',
    docType: 'REPORT'
  },
  {
    id: 'd2',
    title: 'Budget 2024',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: '4',
    version: 2,
    type: 'excel',
    docType: 'SHEET'
  },
  {
    id: 'd3',
    title: 'Resume',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: '2',
    version: 1,
    type: 'word',
    docType: 'CV'
  }
];

export default function App() {
  const [folders, setFolders] = useState<any[]>(INITIAL_FOLDERS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const ROOT_SEGMENT = 'DOCUMENT';

  // --- Logic to build tree structure for FileExplorer ---
  const folderTree = useMemo(() => {
    // Create a map for quick lookup
    const folderMap: Record<string, Folder> = {};
    
    // Initialize map
    folders.forEach(f => {
      folderMap[f.id] = {
        ...f,
        children: [],
        documents: documents.filter(d => d.folderId === f.id),
        isExpanded: false
      };
    });

    // Build tree
    const rootFolders: Folder[] = [];
    folders.forEach(f => {
      if (f.parentId && folderMap[f.parentId]) {
        folderMap[f.parentId].children.push(folderMap[f.id]);
      } else {
        rootFolders.push(folderMap[f.id]);
      }
    });

    return rootFolders;
  }, [folders, documents]);

  // --- Helpers for navigation ---
  const findFolderByPath = (path: string[], currentNodes: Folder[]): Folder | null => {
    // path example: ['DOCUMENT', 'Work Documents', 'Projects']
    // Remove root segment if present
    const actualPath = path[0] === ROOT_SEGMENT ? path.slice(1) : path;
    
    if (actualPath.length === 0) return null; // Root

    let currentLevel = currentNodes;
    let foundFolder: Folder | null = null;

    for (const segment of actualPath) {
      const match = currentLevel.find(f => f.name === segment);
      if (!match) return null;
      foundFolder = match;
      currentLevel = match.children;
    }
    return foundFolder;
  };

  const handleOpenFolder = (path: string[]) => {
    if (path.length <= 1) {
      setCurrentFolderId(null); // Go to root
      return;
    }
    
    // The path comes in as [ROOT, 'Name', 'SubName']
    // We need to find the ID of the last item in the path
    // Since names might not be unique globally, we must traverse from root
    const targetFolder = findFolderByPath(path, folderTree);
    if (targetFolder) {
      setCurrentFolderId(targetFolder.id);
    } else {
      console.warn("Could not resolve path to folder ID:", path);
      // Fallback: If we can't find it by path traversal, maybe we are at root
      setCurrentFolderId(null);
    }
  };

  const handleBreadcrumbClick = (id: string | null) => {
      setCurrentFolderId(id);
  }

  // --- CRUD Handlers ---

  const handleFolderCreate = (parentId?: string) => {
    const newName = prompt("Enter folder name:", "New Folder");
    if (!newName) return;
    
    const newFolder = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      parentId: parentId
    };
    setFolders([...folders, newFolder]);
  };

  const handleDocumentCreate = (folderId?: string, type: 'word' | 'excel' = 'word') => {
    const newTitle = prompt(`Enter ${type} name:`, "Untitled");
    if (!newTitle) return;

    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: folderId,
      version: 1,
      type: type,
      docType: type === 'excel' ? 'SHEET' : 'DOC'
    };
    setDocuments([...documents, newDoc]);
  };

  const handleFolderEdit = (id: string, newName: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const handleDocumentRename = (id: string, newTitle: string) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, title: newTitle } : d));
  };

  const handleFolderDelete = (id: string) => {
    if (!confirm("Delete this folder and its contents?")) return;
    // Recursive delete is complex with flat state, simplifying for demo:
    // Delete the folder and any immediate children (not recursive deep in this simple implementation)
    setFolders(folders.filter(f => f.id !== id && f.parentId !== id));
    setDocuments(documents.filter(d => d.folderId !== id));
    if (currentFolderId === id) setCurrentFolderId(null);
  };

  const handleDocumentDelete = (id: string) => {
    if (!confirm("Delete this document?")) return;
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleUpload = () => {
    // Simulation
    const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Uploaded File ${documents.length + 1}.pdf`,
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderId: currentFolderId || undefined,
        version: 1,
        type: 'word',
        docType: 'PDF'
      };
      setDocuments([...documents, newDoc]);
  };

  const handleMoveItems = (items: { id: string, type: 'folder' | 'document' }[], destinationFolderId: string) => {
    // Process Folders
    const folderIds = items.filter(i => i.type === 'folder').map(i => i.id);
    if (folderIds.length > 0) {
        setFolders(folders.map(f => folderIds.includes(f.id) ? { ...f, parentId: destinationFolderId || undefined } : f));
    }

    // Process Documents
    const docIds = items.filter(i => i.type === 'document').map(i => i.id);
    if (docIds.length > 0) {
        setDocuments(documents.map(d => docIds.includes(d.id) ? { ...d, folderId: destinationFolderId || undefined } : d));
    }
  };

  const handleDeleteItems = (items: { id: string, type: 'folder' | 'document' }[]) => {
      if(!confirm(`Are you sure you want to delete ${items.length} items?`)) return;

      const folderIds = items.filter(i => i.type === 'folder').map(i => i.id);
      const docIds = items.filter(i => i.type === 'document').map(i => i.id);

      if (folderIds.length > 0) {
        setFolders(folders.filter(f => !folderIds.includes(f.id)));
      }
      if (docIds.length > 0) {
        setDocuments(documents.filter(d => !docIds.includes(d.id)));
      }
  };

  // --- Breadcrumb Construction (UI Helper) ---
  const getBreadcrumbs = () => {
      if (!currentFolderId) return [{ id: null, name: ROOT_SEGMENT }];
      
      const crumbs = [];
      let current = folders.find(f => f.id === currentFolderId);
      while(current) {
          crumbs.unshift({ id: current.id, name: current.name });
          current = folders.find(f => f.id === current.parentId);
      }
      crumbs.unshift({ id: null, name: ROOT_SEGMENT });
      return crumbs;
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header / Breadcrumbs Area (External to component for demo purposes, although component handles internal nav via double click) */}
      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 overflow-x-auto pb-2">
          {getBreadcrumbs().map((crumb, index, arr) => (
              <React.Fragment key={crumb.id || 'root'}>
                  <button 
                    onClick={() => handleBreadcrumbClick(crumb.id)}
                    className={`hover:text-blue-600 hover:underline flex items-center ${index === arr.length - 1 ? 'font-bold text-gray-900 dark:text-white pointer-events-none' : ''}`}
                  >
                      {index === 0 && <Home className="w-4 h-4 mr-1"/>}
                      {crumb.name}
                  </button>
                  {index < arr.length - 1 && <span className="text-gray-400">/</span>}
              </React.Fragment>
          ))}
      </div>

      <div className="flex-1 min-h-0">
        <FileExplorer 
            folders={folderTree}
            documents={documents.filter(d => !d.folderId)} // Root documents passed here, children are inside folderTree structure
            currentFolderId={currentFolderId}
            onOpenFolder={handleOpenFolder}
            onFolderCreate={handleFolderCreate}
            onFolderEdit={handleFolderEdit}
            onFolderDelete={handleFolderDelete}
            onDocumentCreate={handleDocumentCreate}
            onDocumentEdit={(id) => alert(`Edit document ${id}`)}
            onDocumentRename={handleDocumentRename}
            onDocumentDelete={handleDocumentDelete}
            onDocumentView={(id) => alert(`View document ${id}`)}
            onUpload={handleUpload}
            rootSegment={ROOT_SEGMENT}
            onMoveItems={handleMoveItems}
            onDeleteItems={handleDeleteItems}
            onDocumentSendForReview={(id) => alert(`Sent ${id} for review`)}
            onDocumentEditAsNewVersion={(id) => alert(`New version of ${id}`)}
            onDocumentViewActivity={(id) => alert(`Activity for ${id}`)}
        />
      </div>
    </div>
  );
}