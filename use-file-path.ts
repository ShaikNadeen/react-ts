import {useCallback, useMemo} from 'react';

interface FileItem {
	path: string;
	dependencies: {
		internal: string[];
	};
}
//building paths for all the parent files and child paths(internal paths) and returing items that is passed to search compoent
export const useFilePaths = (files: FileItem[], rootFilePath: string) => {
	// Create parent-child map from files
	const parentChildMap = useMemo(() => {
		const map: Map<string, string[]> = new Map<string, string[]>();
		files.forEach((item) => {
			const fileName = item.path.split('/').pop();
			if (fileName) {
				map.set(fileName, []);
				item.dependencies.internal.forEach((internalPath) => {
					const internalFileName = internalPath.split('/').pop();
					if (internalFileName) {
						const internalFiles = map.get(fileName);
						if (internalFiles) {
							internalFiles.push(internalFileName);
						}
					}
				});
			}
		});
		return map;
	}, [files]);

	console.log('PARENT_CHILD_MAP:', parentChildMap);
	// Build paths recursively
	const buildPaths = useCallback((map: Map<string, string[]>, currentPath: string, visited: Set<string>): string[] => {
		const result: string[] = [];
		const currentFileName = currentPath.split('/').pop();
		if (currentFileName && map.has(currentFileName) && !visited.has(currentFileName)) {
			visited.add(currentFileName);
			const children = map.get(currentFileName);
			if (children && children.length > 0) {
				children.forEach((child) => {
					const fullPath = `${currentPath}/${child}`;
					if (!visited.has(child)) {
						result.push(fullPath, ...buildPaths(map, fullPath, visited));
					}
				});
			}
		}
		return result;
	}, []);

	// Generate all paths based on files
	const allPaths: string[] = useMemo(() => {
		const paths: string[] = [];
		files.forEach((item) => {
			const filePaths = buildPaths(parentChildMap, item.path, new Set<string>());
			paths.push(item.path, ...filePaths);
		});
		return paths;
	}, [buildPaths, files, parentChildMap]);

	// Create items from all paths
	const items = useMemo(() => {
		const result: {id: string; name: string}[] = [];
		const root = rootFilePath;
		allPaths.forEach((path, index) => {
			if (path.includes(root)) {
				result.push({
					id: index.toString(),
					name: path
				});
			}
		});
		return result;
	}, [allPaths, rootFilePath]);

	return {items};
};
