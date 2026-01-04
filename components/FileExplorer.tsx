import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent } from 'react';
import {
    LayoutGrid,
    List,
    ArrowUp,
    ArrowDown,
    Search,
    Plus,
    CheckSquare,
    Edit,
    Eye,
    Copy,
    Send,
    History,
    X,
    MoreVertical,
    Trash2,
    CloudUpload,
    FileText,
    Sheet
} from 'lucide-react';
import { Tooltip } from './Tooltip';

type IconProps = React.SVGProps<SVGSVGElement>;

export const FolderIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

export const FolderSolidIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 6h-6.425a1.5 1.5 0 01-1.06-.44L10.88 4.44A1.5 1.5 0 009.82 4H4.5A2.25 2.25 0 002.25 6.25v10.5A2.25 2.25 0 004.5 19h15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0019.5 6z" />
    </svg>
);

export const FileIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

export const WordIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillOpacity="0.1" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 9H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const ExcelIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillOpacity="0.1" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M8 13V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 13V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    folderId?: string;
    version: number;
    type: 'word' | 'excel';
    docType?: string;
}

export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    children: Folder[];
    documents: Document[];
    isExpanded: boolean;
}

interface FileExplorerProps {
    folders: Folder[];
    documents: Document[]; // Root documents or all documents if needed
    currentFolderId: string | null;
    onOpenFolder: (path: string[]) => void;
    onFolderCreate: (parentId?: string) => void;
    onFolderEdit: (folderId: string, newName: string) => void;
    onFolderDelete: (folderId: string) => void;
    onDocumentCreate: (folderId?: string, type?: 'word' | 'excel') => void;
    onDocumentEdit: (documentId: string) => void;
    onDocumentRename?: (documentId: string, newTitle: string) => void;
    onDocumentDelete: (documentId: string) => void;
    onDocumentView: (documentId: string) => void;
    onDocumentEditAsNewVersion?: (documentId: string) => void;
    onDocumentSendForReview?: (documentId: string) => void;
    onDocumentViewActivity?: (documentId: string) => void;
    onUpload: () => void;
    rootSegment?: string; // The root segment for the file system, e.g. "DOCUMENT" for QMS
    // The following props are for multi-item operations.
    // The parent component should implement the logic for these.
    onDownloadItems?: (items: { id: string, type: 'folder' | 'document' }[]) => void;
    onMoveItems?: (items: { id: string, type: 'folder' | 'document' }[], destinationFolderId: string) => void;
    onCopyItems?: (items: { id: string, type: 'folder' | 'document' }[], destinationFolderId: string) => void;
    onDeleteItems?: (items: { id: string, type: 'folder' | 'document' }[]) => void;
}

type SortKey = 'name' | 'updatedAt' | 'type';
type SortOrder = 'asc' | 'desc';

export default function FileExplorer({
    folders,
    documents,
    currentFolderId,
    onOpenFolder,
    onFolderCreate,
    onFolderEdit,
    onFolderDelete,
    onDocumentCreate,
    onDocumentEdit,
    onDocumentRename,
    onDocumentDelete,
    onDocumentView,
    onDocumentEditAsNewVersion,
    onDocumentSendForReview,
    onDocumentViewActivity,
    onUpload,
    rootSegment = "DOCUMENT",
    onDownloadItems,
    onMoveItems,
    onCopyItems,
    onDeleteItems
}: FileExplorerProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>('type');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [newFileMenuOpen, setNewFileMenuOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        itemId: string;
        itemType: 'folder' | 'document';
    } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [showMoveCopyModal, setShowMoveCopyModal] = useState<{
        action: 'move' | 'copy';
        items: { id: string, type: 'folder' | 'document' }[];
    } | null>(null);
    const [selectedDestinationFolder, setSelectedDestinationFolder] = useState<string | null>(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameItem, setRenameItem] = useState<{ id: string, type: 'folder' | 'document', currentName: string } | null>(null);
    const [newName, setNewName] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [sortMenuPos, setSortMenuPos] = useState({ top: 0, left: 0 });
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // -----------------------------------------------------------------
    // Mobile responsiveness and Click Outside
    // -----------------------------------------------------------------
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        const handleClickOutside = (event: Event) => {
            if (sortMenuOpen && !(event.target as Element).closest('.group\\/sort')) {
                setSortMenuOpen(false);
            }
            if (newFileMenuOpen && !(event.target as Element).closest('.group\\/newfile')) {
                setNewFileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sortMenuOpen, newFileMenuOpen]);

    // Helper to find a folder by ID recursively
    const findFolder = (id: string, list: Folder[]): Folder | null => {
        for (const folder of list) {
            if (folder.id === id) return folder;
            const found = findFolder(id, folder.children);
            if (found) return found;
        }
        return null;
    };

    // Helper to get folder path
    const getFolderPath = (folder: Folder): string[] => {
        const path: string[] = [];
        let current: Folder | null = folder;
        while (current) {
            path.unshift(current.name);
            if (!current.parentId) break;
            current = findFolder(current.parentId, folders) || null;
        }
        return rootSegment ? [rootSegment, ...path] : path;
    };

    const currentFolder = currentFolderId ? findFolder(currentFolderId, folders) : null;

    // Get items to display in the main view
    const displayFolders = currentFolder ? currentFolder.children : folders.filter(f => !f.parentId);
    const displayDocuments = documents.filter(d =>
        currentFolderId ? d.folderId === currentFolderId : !d.folderId
    );

    // Handle context menu
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        };
        if (contextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [contextMenu]);

    // Filter by search
    const filteredFolders = displayFolders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredDocuments = displayDocuments.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const { sortedFolders, sortedDocuments } = useMemo(() => {
        const combined = [
            ...filteredFolders.map(f => ({ ...f, itemType: 'folder' as const, title: f.name, updatedAt: '' })),
            ...filteredDocuments.map(d => ({ ...d, itemType: 'document' as const, title: d.title }))
        ];

        const order = sortOrder === 'asc' ? 1 : -1;

        combined.sort((a, b) => {
            if (sortKey === 'name') {
                return a.title.localeCompare(b.title) * order;
            }

            if (sortKey === 'type') {
                if (a.itemType !== b.itemType) {
                    if (sortOrder === 'asc') {
                        return a.itemType === 'folder' ? -1 : 1;
                    } else {
                        return a.itemType === 'document' ? -1 : 1;
                    }
                }
                return a.title.localeCompare(b.title) * order;
            }

            if (sortKey === 'updatedAt') {
                const aIsFolder = a.itemType === 'folder';
                const bIsFolder = b.itemType === 'folder';

                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;

                if (aIsFolder && bIsFolder) {
                    return a.title.localeCompare(b.title) * order;
                }

                const dateA = new Date(a.updatedAt).getTime();
                const dateB = new Date(b.updatedAt).getTime();
                return (dateA - dateB) * order;
            }

            return 0;
        });

        const finalFolders = combined.filter(i => i.itemType === 'folder').map(({ itemType: _itemType, title: _title, ...rest }) => rest as Folder);
        const finalDocs = combined.filter(i => i.itemType === 'document').map(({ itemType: _itemType, title: _title, ...rest }) => rest as Document);

        return { sortedFolders: finalFolders, sortedDocuments: finalDocs };
    }, [filteredFolders, filteredDocuments, sortKey, sortOrder]);


    const handleContextMenu = (e: MouseEvent, itemId: string, itemType: 'folder' | 'document') => {
        e.preventDefault();
        e.stopPropagation();

        if (isMobile) {
            // On mobile, center the menu
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const menuWidth = 200; // Approximate menu width for mobile
            const menuHeight = 250; // Approximate menu height for mobile

            setContextMenu({
                x: (viewportWidth - menuWidth) / 2,
                y: (viewportHeight - menuHeight) / 2,
                itemId,
                itemType
            });
        } else {
            // Desktop positioning logic
            const menuWidth = 200; // Increased width for better readability
            const menuHeight = 220; // Approximate menu height
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x: number, y: number;

            if ((e.currentTarget as HTMLElement).tagName === 'BUTTON') {
                // Position next to the three-dot button
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                x = rect.right + 5;
                y = rect.top;

                // Adjust if menu would overflow right edge
                if (x + menuWidth > viewportWidth) {
                    x = rect.left - menuWidth - 5;
                }

                // Adjust if menu would overflow bottom edge
                if (y + menuHeight > viewportHeight) {
                    y = viewportHeight - menuHeight - 10;
                }
            } else {
                // For right-click on item, use mouse position with adjustments
                x = e.clientX;
                y = e.clientY;

                // Adjust if menu would overflow right edge
                if (x + menuWidth > viewportWidth) {
                    x = viewportWidth - menuWidth - 10;
                }

                // Adjust if menu would overflow bottom edge
                if (y + menuHeight > viewportHeight) {
                    y = e.clientY - menuHeight - 10;
                }
            }

            setContextMenu({
                x: Math.max(10, x), // Ensure minimum margin from left
                y: Math.max(10, y), // Ensure minimum margin from top
                itemId,
                itemType
            });
        }
    };

    const handleSelectAll = useCallback(() => {
        const allItemIds = [...filteredFolders.map(f => f.id), ...filteredDocuments.map(d => d.id)];
        if (selectedItems.length === allItemIds.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(allItemIds);
        }
    }, [filteredFolders, filteredDocuments, selectedItems]);

    const getSelectedItemsWithTypes = useCallback(() => {
        return selectedItems.map(id => {
            const isFolder = sortedFolders.some(f => f.id === id) || folders.some(f => f.id === id);
            return { id, type: isFolder ? 'folder' : 'document' as 'folder' | 'document' };
        });
    }, [selectedItems, sortedFolders, folders]);

    const handleDelete = useCallback(() => {
        if (selectedItems.length === 0) return;

        if (onDeleteItems) {
            const items = getSelectedItemsWithTypes();
            onDeleteItems(items);
        } else {
            // Fallback to individual delete if bulk delete not provided
            const items = getSelectedItemsWithTypes();
            items.forEach(item => {
                if (item.type === 'folder') {
                    onFolderDelete(item.id);
                } else {
                    onDocumentDelete(item.id);
                }
            });
        }
        setSelectedItems([]);
    }, [selectedItems, onDeleteItems, getSelectedItemsWithTypes, onFolderDelete, onDocumentDelete]);

    const handleRenameClick = useCallback(() => {
        if (selectedItems.length !== 1) return;

        const selectedId = selectedItems[0];
        const folder = sortedFolders.find(f => f.id === selectedId);
        if (folder) {
            setRenameItem({ id: selectedId, type: 'folder', currentName: folder.name });
            setNewName(folder.name);
            setShowRenameModal(true);
        } else {
            const doc = sortedDocuments.find(d => d.id === selectedId);
            if (doc) {
                setRenameItem({ id: selectedId, type: 'document', currentName: doc.title });
                setNewName(doc.title);
                setShowRenameModal(true);
            }
        }
    }, [selectedItems, sortedFolders, sortedDocuments]);

    const handleDownload = () => {
        if (selectedItems.length === 0) return;
        const items = getSelectedItemsWithTypes();
        if (onDownloadItems) {
            onDownloadItems(items);
        } else {
            alert(`Downloading ${items.length} items: ${JSON.stringify(items)}`);
        }
    };

    const handleMove = () => {
        if (selectedItems.length === 0) return;
        const items = getSelectedItemsWithTypes();
        setShowMoveCopyModal({ action: 'move', items });
        setSelectedDestinationFolder(null);
    };

    const handleCopy = useCallback(() => {
        if (selectedItems.length === 0) return;
        const items = getSelectedItemsWithTypes();
        setShowMoveCopyModal({ action: 'copy', items });
        setSelectedDestinationFolder(null);
    }, [selectedItems, getSelectedItemsWithTypes]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Select All (Ctrl+A / Cmd+A)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                handleSelectAll();
            }
            // Delete (Del)
            if (e.key === 'Delete' && selectedItems.length > 0) {
                e.preventDefault();
                handleDelete();
            }
            // Search (Ctrl+F / Cmd+F)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            // Rename (F2)
            if (e.key === 'F2' && selectedItems.length === 1) {
                e.preventDefault();
                handleRenameClick();
            }
            // Copy (Ctrl+C)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && selectedItems.length > 0) {
                e.preventDefault();
                handleCopy();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItems, filteredFolders, filteredDocuments, handleSelectAll, handleDelete, handleRenameClick, handleCopy]);

    const handleMoveCopyConfirm = () => {
        if (!showMoveCopyModal || !selectedDestinationFolder) return;

        if (showMoveCopyModal.action === 'move' && onMoveItems) {
            onMoveItems(showMoveCopyModal.items, selectedDestinationFolder);
        } else if (showMoveCopyModal.action === 'copy' && onCopyItems) {
            onCopyItems(showMoveCopyModal.items, selectedDestinationFolder);
        }

        setShowMoveCopyModal(null);
        setSelectedDestinationFolder(null);
        setSelectedItems([]);
    };

    return (
        <div className="relative flex h-full min-h-0 flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-10 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800 flex-shrink-0 z-20">
                    <div className="flex items-center w-full px-6 gap-6">

                        {/* Group 1 - Left: Selection & navigation */}
                        <div className="flex items-center gap-4 pr-3 border-r border-gray-200 dark:border-gray-700">
                            <Tooltip text="Select All (Ctrl+A)">
                                <button
                                    onClick={handleSelectAll}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md border transition-colors ${selectedItems.length > 0 ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'}`}
                                >
                                    <CheckSquare className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Sort">
                                <div className="relative group/sort">
                                    <button
                                        ref={sortButtonRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (sortMenuOpen) {
                                                setSortMenuOpen(false);
                                            } else {
                                                if (sortButtonRef.current) {
                                                    const rect = sortButtonRef.current.getBoundingClientRect();
                                                    setSortMenuPos({ top: rect.bottom + 5, left: rect.left });
                                                }
                                                setSortMenuOpen(true);
                                            }
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                    >
                                        {sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    </button>
                                </div>
                            </Tooltip>
                            {sortMenuOpen && createPortal(
                                <div
                                    className="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[9999] border border-gray-200 dark:border-gray-700"
                                    style={{ top: sortMenuPos.top, left: sortMenuPos.left }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-1">
                                        <div className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 px-3 py-2">Sort By</div>
                                        <button onClick={() => { setSortKey('name'); setSortMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${sortKey === 'name' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}>Name</button>
                                        <button onClick={() => { setSortKey('updatedAt'); setSortMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${sortKey === 'updatedAt' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}>Date Modified</button>
                                        <button onClick={() => { setSortKey('type'); setSortMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${sortKey === 'type' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}>Type</button>
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                        <div className="font-bold text-xs uppercase text-gray-400 dark:text-gray-500 px-3 py-2">Order</div>
                                        <button onClick={() => { setSortOrder('asc'); setSortMenuOpen(false); }} className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md ${sortOrder === 'asc' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                            <ArrowUp className="w-4 h-4 mr-2" />
                                            Ascending
                                        </button>
                                        <button onClick={() => { setSortOrder('desc'); setSortMenuOpen(false); }} className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md ${sortOrder === 'desc' ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-50 dark:hover:bg-gray-700`}>
                                            <ArrowDown className="w-4 h-4 mr-2" />
                                            Descending
                                        </button>
                                    </div>
                                </div>,
                                document.body
                            )}

                            <Tooltip text="Move (Ctrl+X)">
                                <button
                                    onClick={handleMove}
                                    disabled={selectedItems.length === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <div className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent border-gray-200 dark:border-gray-600">
                                <Tooltip text="Toggle View">
                                    <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="w-full h-full flex items-center justify-center text-gray-700 dark:text-gray-200">
                                        {viewMode === 'grid' ? <LayoutGrid className="w-3 h-3" /> : <List className="w-3 h-3" />}
                                    </button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Group 2 - Center: Search (dominant) */}
                        <div className="flex-1 flex justify-center">
                            <div className="relative w-full max-w-xl flex items-center justify-center">
                                <Search className="w-4 h-4 absolute left-3 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search documents, folders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-3 h-8 w-[240px] sm:w-[320px] text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Group 3 - Right: Document actions */}
                        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                            <Tooltip text="Copy (Ctrl+C)">
                                <button
                                    onClick={handleCopy}
                                    disabled={selectedItems.length === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Rename (F2)">
                                <button
                                    onClick={handleRenameClick}
                                    disabled={selectedItems.length !== 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Edit className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Download">
                                <button
                                    onClick={handleDownload}
                                    disabled={selectedItems.length === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowDown className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Send for Review">
                                <button
                                    onClick={() => {
                                        if (selectedItems.length === 1 && onDocumentSendForReview) {
                                            onDocumentSendForReview(selectedItems[0]);
                                        }
                                    }}
                                    disabled={selectedItems.length !== 1 || !onDocumentSendForReview}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Delete (Del)">
                                <button
                                    onClick={handleDelete}
                                    disabled={selectedItems.length === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-md border bg-transparent hover:bg-red-500 hover:text-white border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </Tooltip>
                        </div>

                        {/* Group 4 - Far Right: Primary actions */}
                        <div className="flex items-center gap-2 ml-auto">
                             <div className="relative group/newfile">
                                <button
                                    onClick={() => setNewFileMenuOpen(!newFileMenuOpen)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                                {newFileMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    onDocumentCreate(currentFolderId || undefined, 'word');
                                                    setNewFileMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                            >
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                Word Document
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDocumentCreate(currentFolderId || undefined, 'excel');
                                                    setNewFileMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                            >
                                                <Sheet className="w-4 h-4 text-green-600" />
                                                Excel Spreadsheet
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Tooltip text="New Folder">
                                <button
                                    onClick={() => onFolderCreate(currentFolderId || undefined)}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    <FolderIcon className="w-3 h-3" />
                                </button>
                            </Tooltip>

                            <Tooltip text="Upload">
                                <button
                                    onClick={onUpload}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    <CloudUpload className="w-3 h-3" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                {/* File View */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-0" onClick={() => { setSelectedItems([]); }}>
                    {sortedFolders.length === 0 && sortedDocuments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <FolderIcon className="w-20 h-20 mb-6 opacity-10" />
                            <p className="text-lg font-medium text-gray-500">This folder is empty</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                    {/* Folders */}
                                    {sortedFolders.map(folder => (
                                        <div
                                            key={folder.id}
                                            className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${selectedItems.includes(folder.id) ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (selectedItems.includes(folder.id)) {
                                                    setSelectedItems(selectedItems.filter(id => id !== folder.id));
                                                } else {
                                                    setSelectedItems([...selectedItems, folder.id]);
                                                }
                                            }}
                                            onDoubleClick={() => onOpenFolder(getFolderPath(folder))}
                                            onContextMenu={(e) => handleContextMenu(e, folder.id, 'folder')}
                                        >
                                            <div className="p-5 flex flex-col items-center justify-center min-h-[160px]">
                                                {/* Consistent solid black folder icon */}
                                                <FolderSolidIcon className="w-20 h-20 text-black dark:text-white drop-shadow-sm mb-3" />

                                                <div className="text-center w-full px-2">
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base mb-1" title={folder.name}>
                                                        {folder.name}
                                                    </div>
                                                </div>

                                                {/* Count Bubble Bottom Left */}
                                                <div className="absolute bottom-3 left-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                                                    {folder.children.length + folder.documents.length}
                                                </div>
                                            </div>

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(folder.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        if (selectedItems.includes(folder.id)) {
                                                            setSelectedItems(selectedItems.filter(id => id !== folder.id));
                                                        } else {
                                                            setSelectedItems([...selectedItems, folder.id]);
                                                        }
                                                    }}
                                                    className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>

                                            {/* Selection Checkmark Overlay */}
                                            {selectedItems.includes(folder.id) && (
                                                <div className="absolute top-3 left-3 bg-blue-500 rounded-lg p-0.5 z-10 pointer-events-none">
                                                    <CheckSquare className="w-4 h-4 text-white" />
                                                </div>
                                            )}

                                            {/* Context Menu Trigger */}
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleContextMenu(e, folder.id, 'folder');
                                                    }}
                                                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Documents */}
                                    {sortedDocuments.map(doc => (
                                        <div
                                            key={doc.id}
                                            className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col ${selectedItems.includes(doc.id) ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (selectedItems.includes(doc.id)) {
                                                    setSelectedItems(selectedItems.filter(id => id !== doc.id));
                                                } else {
                                                    setSelectedItems([...selectedItems, doc.id]);
                                                }
                                            }}
                                            onDoubleClick={() => onDocumentView(doc.id)}
                                            onContextMenu={(e) => handleContextMenu(e, doc.id, 'document')}
                                        >
                                            {/* Header Strip */}
                                            <div className="h-8 bg-gray-100 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    {doc.docType || (doc.type === 'excel' ? 'EXCEL' : 'WORD')}
                                                </span>
                                                {/* Status Color Dot */}
                                                <div className={`w-2 h-2 rounded-full ${doc.version > 1 ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            </div>

                                            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-[130px]">
                                                {doc.type === 'excel' ? (
                                                    <ExcelIcon className="w-12 h-12 text-green-600 mb-3" />
                                                ) : (
                                                    <WordIcon className="w-12 h-12 text-blue-600 mb-3" />
                                                )}

                                                <div className="text-center w-full px-1 mb-2">
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm" title={doc.title}>
                                                        {doc.title || 'Untitled'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                        {new Date(doc.updatedAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* Version Badge - Prominent */}
                                                <div className={`mt-auto px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${doc.version > 1
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    V{doc.version} {doc.version > 1 ? 'APPROVED' : 'DRAFT'}
                                                </div>
                                            </div>

                                            {/* Selection Checkbox */}
                                            <div className="absolute top-10 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(doc.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        if (selectedItems.includes(doc.id)) {
                                                            setSelectedItems(selectedItems.filter(id => id !== doc.id));
                                                        } else {
                                                            setSelectedItems([...selectedItems, doc.id]);
                                                        }
                                                    }}
                                                    className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                />
                                            </div>
                                            {/* Selection Checkmark Overlay */}
                                            {selectedItems.includes(doc.id) && (
                                                <div className="absolute top-10 left-3 bg-blue-500 rounded-lg p-0.5 z-10 pointer-events-none">
                                                    <CheckSquare className="w-4 h-4 text-white" />
                                                </div>
                                            )}

                                            {/* Context Menu Trigger */}
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleContextMenu(e, doc.id, 'document');
                                                    }}
                                                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="min-w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="flex px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                        <div className="w-12"></div>
                                        <div className="flex-1">Name</div>
                                        <div className="w-32">Type</div>
                                        <div className="w-24">Version</div>
                                        <div className="w-32">Status</div>
                                        <div className="w-32">Updated</div>
                                        <div className="w-24">Size</div>
                                        <div className="w-10"></div>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {sortedFolders.map(folder => (
                                            <div
                                                key={folder.id}
                                                className={`group flex px-6 py-4 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedItems.includes(folder.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (selectedItems.includes(folder.id)) {
                                                        setSelectedItems(selectedItems.filter(id => id !== folder.id));
                                                    } else {
                                                        setSelectedItems([...selectedItems, folder.id]);
                                                    }
                                                }}
                                                onDoubleClick={() => onOpenFolder(getFolderPath(folder))}
                                                onContextMenu={(e) => handleContextMenu(e, folder.id, 'folder')}
                                            >
                                                <div className="w-12 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(folder.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (selectedItems.includes(folder.id)) {
                                                                setSelectedItems(selectedItems.filter(id => id !== folder.id));
                                                            } else {
                                                                setSelectedItems([...selectedItems, folder.id]);
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </div>
                                                <div className="flex-1 truncate font-medium flex items-center text-gray-900 dark:text-gray-100">
                                                    <FolderSolidIcon className="w-5 h-5 text-gray-800 dark:text-gray-200 mr-4" />
                                                    <span className="text-sm">{folder.name}</span>
                                                </div>
                                                <div className="w-32 text-sm text-gray-500">Folder</div>
                                                <div className="w-24 text-sm text-gray-500">-</div>
                                                <div className="w-32 text-sm text-gray-500">-</div>
                                                <div className="w-32 text-sm text-gray-500">-</div>
                                                <div className="w-24 text-sm text-gray-500">{folder.children.length + folder.documents.length} items</div>
                                                <div className="w-10 flex justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleContextMenu(e, folder.id, 'folder');
                                                        }}
                                                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {sortedDocuments.map(doc => (
                                            <div
                                                key={doc.id}
                                                className={`group flex px-6 py-4 items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedItems.includes(doc.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (selectedItems.includes(doc.id)) {
                                                        setSelectedItems(selectedItems.filter(id => id !== doc.id));
                                                    } else {
                                                        setSelectedItems([...selectedItems, doc.id]);
                                                    }
                                                }}
                                                onDoubleClick={() => onDocumentView(doc.id)}
                                                onContextMenu={(e) => handleContextMenu(e, doc.id, 'document')}
                                            >
                                                <div className="w-12 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(doc.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (selectedItems.includes(doc.id)) {
                                                                setSelectedItems(selectedItems.filter(id => id !== doc.id));
                                                            } else {
                                                                setSelectedItems([...selectedItems, doc.id]);
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                </div>
                                                <div className="flex-1 truncate font-medium flex items-center text-gray-900 dark:text-gray-100">
                                                    {doc.type === 'excel' ? (
                                                        <ExcelIcon className="w-5 h-5 text-green-600 mr-4" />
                                                    ) : (
                                                        <WordIcon className="w-5 h-5 text-blue-600 mr-4" />
                                                    )}
                                                    <span className="text-sm">
                                                        {doc.title || 'Untitled'}
                                                    </span>
                                                </div>
                                                <div className="w-32 text-sm text-gray-500">
                                                    {doc.docType || (doc.type === 'excel' ? 'Spreadsheet' : 'Word Doc')}
                                                </div>
                                                <div className="w-24 text-sm text-gray-500 font-medium">V{doc.version}</div>
                                                <div className="w-32 text-sm">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${doc.version > 1 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                                        {doc.version > 1 ? 'Approved' : 'Under Review'}
                                                    </span>
                                                </div>
                                                <div className="w-32 text-sm text-gray-500">
                                                    {new Date(doc.updatedAt).toLocaleDateString()}
                                                </div>
                                                <div className="w-24 text-sm text-gray-500">12 KB</div>
                                                <div className="w-10 flex justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleContextMenu(e, doc.id, 'document');
                                                        }}
                                                        className={`p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isMobile ? 'p-2' : ''}`}
                                                    >
                                                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                            }
                        </>
                    )}
                </div >

                {/* Status Bar */}
                < div className="h-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-500" >
                    <span className="mr-4">{sortedFolders.length + sortedDocuments.length} items</span>
                    {selectedItems.length > 0 && <span>{selectedItems.length} item(s) selected</span>}
                </div >
            </div >

            {/* Context Menu */}
            {
                contextMenu && (
                    <>
                        {isMobile && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                                onClick={() => setContextMenu(null)}
                            />
                        )}
                        <div
                            ref={contextMenuRef}
                            className={`fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px]`}
                            style={{
                                left: contextMenu.x,
                                top: contextMenu.y,
                            }}
                        >
                            {contextMenu.itemType === 'document' ? (
                                <>
                                    <button
                                        onClick={() => {
                                            onDocumentView(contextMenu.itemId);
                                            setContextMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            const doc = sortedDocuments.find(d => d.id === contextMenu.itemId);
                                            if (doc) {
                                                setRenameItem({ id: contextMenu.itemId, type: 'document', currentName: doc.title });
                                                setNewName(doc.title);
                                                setShowRenameModal(true);
                                            }
                                            setContextMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDocumentEdit(contextMenu.itemId);
                                            setContextMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    {onDocumentEditAsNewVersion && (
                                        <button
                                            onClick={() => {
                                                onDocumentEditAsNewVersion(contextMenu.itemId);
                                                setContextMenu(null);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Edit as New Version
                                        </button>
                                    )}
                                    {onDocumentSendForReview && (
                                        <button
                                            onClick={() => {
                                                onDocumentSendForReview(contextMenu.itemId);
                                                setContextMenu(null);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Send className="w-4 h-4" />
                                            Send for Review
                                        </button>
                                    )}
                                    {onDocumentViewActivity && (
                                        <button
                                            onClick={() => {
                                                onDocumentViewActivity(contextMenu.itemId);
                                                setContextMenu(null);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <History className="w-4 h-4" />
                                            Activity & History
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            const folder = findFolder(contextMenu.itemId, folders);
                                            if (folder) onOpenFolder(getFolderPath(folder));
                                            setContextMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Open
                                    </button>
                                    <button
                                        onClick={() => {
                                            const folder = findFolder(contextMenu.itemId, folders);
                                            if (folder) {
                                                setRenameItem({ id: contextMenu.itemId, type: 'folder', currentName: folder.name });
                                                setNewName(folder.name);
                                                setShowRenameModal(true);
                                            }
                                            setContextMenu(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Rename
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )
            }

            {/* Move/Copy Modal */}
            {
                showMoveCopyModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {showMoveCopyModal.action === 'move' ? 'Move' : 'Copy'} {showMoveCopyModal.items.length} item(s)
                                </h2>
                                <button
                                    onClick={() => setShowMoveCopyModal(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Select destination folder:
                                </label>
                                <select
                                    value={selectedDestinationFolder || ''}
                                    onChange={(e) => setSelectedDestinationFolder(e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                    <option value="">Root (No Folder)</option>
                                    {folders.map(folder => (
                                        <option key={folder.id} value={folder.id}>
                                            {'  '.repeat(getFolderDepth(folder, folders))}📁 {folder.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowMoveCopyModal(null)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMoveCopyConfirm}
                                    disabled={!selectedDestinationFolder}
                                    className={`px-4 py-2 rounded-lg font-medium ${selectedDestinationFolder
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {showMoveCopyModal.action === 'move' ? 'Move' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Rename Modal */}
            {
                showRenameModal && renameItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    Rename {renameItem.type === 'folder' ? 'Folder' : 'Document'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowRenameModal(false);
                                        setRenameItem(null);
                                        setNewName('');
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New name:
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    placeholder="Enter new name"
                                    autoFocus
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        setShowRenameModal(false);
                                        setRenameItem(null);
                                        setNewName('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const trimmed = newName?.trim();
                                        if (trimmed) {
                                            if (renameItem.type === 'folder') {
                                                onFolderEdit(renameItem.id, trimmed);
                                            } else if (onDocumentRename) {
                                                onDocumentRename(renameItem.id, trimmed);
                                            }
                                        }
                                        setShowRenameModal(false);
                                        setRenameItem(null);
                                        setNewName('');
                                    }}
                                    disabled={!newName?.trim() || newName?.trim() === renameItem.currentName}
                                    className={`px-4 py-2 rounded-lg font-medium ${newName?.trim() && newName?.trim() !== renameItem.currentName
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Rename
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

// Helper function to get folder depth for indentation
function getFolderDepth(folder: Folder, allFolders: Folder[]): number {
    let depth = 0;
    let current = folder;
    while (current.parentId) {
        const parent = allFolders.find(f => f.id === current.parentId);
        if (!parent) break;
        depth++;
        current = parent;
    }
    return depth;
}