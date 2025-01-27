/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {ReactNode} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import axios from 'axios';

import {useQuery} from '@tanstack/react-query';

import {useAuth} from './hooks/use-auth';
import {setAccessToken, setLoading, setOauthProviderToken, setUser, setUserPermissionsInfo} from './redux/slices/auth.user.slice';
import {addCodingStandardData} from './redux/slices/coding-standard.slice';
import {RootState} from './redux/store';
import {TUser} from './shared/interfaces/user';
import { getAnsOfQuestionApiDomain} from './shared/services';
import codeApiClient from './shared/services/code-api-client';
import { getAllAssistantDataAppmodDb } from './shared/services/language-onboarding.api.service';
import { setAssistants, setSourceAssistant } from './redux/slices/appmod-assistants.slice';
import Overlay from './shared/components/molecules/overlay.component';
import { CircularSpinner } from './shared/components/atomic-components/loader.component';

const fetchCodingStandards = async ({inputLanguage}: any) => {
	let url = `${getAnsOfQuestionApiDomain}`;
	url += inputLanguage === 'embeddedC' ? `/get_code_profile_language/${inputLanguage}` : `/get_code_profile_scope?scope=Organization`;
	const response = await axios.get(url);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return response.data;
};

const AppWrapper = ({children}: {children: ReactNode}) => {
	const dispatch = useDispatch();
	const {fetchSession, fetchUserRoles} = useAuth();
	const AppState = useSelector((state: RootState) => state.codeConversionSlice);
	const {selectedTab: selectedTabId} = useSelector((state: RootState) => state.tabs);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const inputLanguage = AppState.find((element: any) => element?.id === selectedTabId)?.sourceLanguage;

	const getCodingStandards = async (parameters: any) => {
		try {
			const codingStandard = await fetchCodingStandards(parameters);
			dispatch(
				addCodingStandardData({
					error: '',
					data: codingStandard
				})
			);
			return codingStandard;
		} catch (error) {
			console.error('error->', error);
			dispatch(
				addCodingStandardData({
					error: 'Profiles not found for the given user',
					data: []
				})
			);
		}
	};

	const setUpOnInitialLoad = async () => {
		// await flushApiCall();
		// const [, assistants] = await Promise.all([getCodingStandards({inputLanguage}), getAllAssistantDataAppmodDb()]);
		const [assistants] = await Promise.all([getAllAssistantDataAppmodDb()]);
			if (assistants) {
			dispatch(setAssistants(assistants));
			const selectedAssistant = assistants?.[0];
			dispatch(setSourceAssistant(selectedAssistant));
			}
		// }
		// if (assistants) {
		// 	dispatch(setAssistant(assistants));
		// 	dispatch(setInputLabelMapping(assistants));
		// 	const selectedAssistant = assistants.length >0 && assistants[0];
		// 	dispatch(setSelectedAssistantData(selectedAssistant));
		// }
	};

	const fetchUserInfo = async () => {
		try {
			dispatch(setLoading(true));
			const session = await fetchSession();
			const userRolesData = await fetchUserRoles();

			if (!session) throw new Error('User session not found');

			const {
				user: {accessToken, ...restUser}
			} = session;

			const user: TUser = {
				...restUser
			};
			dispatch(setUserPermissionsInfo(userRolesData.role));
			dispatch(setUser(user));
			dispatch(setAccessToken(accessToken));

			if (session.user.provider) {
				sessionStorage.setItem('git_access_token', session.user.provider.access_token);
				dispatch(
					setOauthProviderToken({
						accessToken: session.user.provider.access_token,
						provider: session.user.provider.provider,
						providerAccountId: session.user.provider.providerAccountId
					})
				);
				// Set access token to axios header
			} else {
				sessionStorage.setItem('git_access_token', 'null');
			}
			codeApiClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
			return session;
		} catch (error) {
			console.log(`error->`, error);
		} finally {
			dispatch(setLoading(false));
		}
	};

	const userQry = useQuery({queryKey: ['currentUser'], queryFn: fetchUserInfo, refetchInterval: 60_000});

	const {isFetching} =useQuery({
		queryKey: ['app-coding-standards-on-init', userQry.data?.user?._id],
		queryFn: setUpOnInitialLoad,
	    enabled: userQry.isSuccess,
		refetchIntervalInBackground:true,
		staleTime:12000,
		refetchOnWindowFocus:false
		
	});

	return <> 
	{children} 
	</>;
};

export default AppWrapper;

