import {useDispatch} from 'react-redux';

import axios from 'axios';

import {setAccessToken, setUser} from '@/redux/slices/auth.user.slice';
import {useTypedSelector} from '@/shared/hooks';
import {TAuthSessionResponse, UserPermissionResponse} from '@/shared/interfaces/user';

const fetchSession = async () => {
	const url = `${import.meta.env?.VITE_APPSEC_BASE_URL}/api/auth/session`;

	const response = await axios.get<TAuthSessionResponse>(url, {
		withCredentials: true
	});

	return response.data;
};

const fetchUserRoles = async () => {
	const url = `${import.meta.env?.VITE_APPSEC_BASE_URL}/api/user/me`;

	const response = await axios.get<UserPermissionResponse>(url, {
		withCredentials: true
	});

	return response.data;
};

type SCOPE = 'orgCs' | 'projectCs' | 'category' | 'project' | 'pack';

type ACTION = 'create' | 'read' | 'update' | 'delete' | 'import' | 'copy';

export const useAuth = () => {
	const dispatch = useDispatch();
	const {user, accessToken, isLoading, userPermissionsInfo} = useTypedSelector((state) => state.auth);

	const logOut = () => {
		dispatch(setUser(null));
		dispatch(setAccessToken(null));
	};

	// return boolean access restriction
	const isAccessAllowed = (scope: SCOPE, action: ACTION) => {
		const permissionNeeded: string = `coding-standard.${scope}-${action}`;
		let doUserHaveAccess: boolean = false;
		userPermissionsInfo.forEach((role) => {
			if (role.name.startsWith('Coding_Standard')) {
				role.permissions.forEach((permission) => {
					if (permission.name === permissionNeeded) {
						doUserHaveAccess = true;
						return doUserHaveAccess;
					}
				});
			}
		});
		return doUserHaveAccess;
	};

	return {user, isLoading, accessToken, logOut, fetchSession, userPermissionsInfo, fetchUserRoles, isAccessAllowed};
};
