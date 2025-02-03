import { useAuth } from '@/hooks/use-auth';
import { setAssistants, setSourceAssistant } from '@/redux/slices/appmod-assistants.slice';
import { getAllAssistantDataAppmodDb } from '@/shared/services/language-onboarding.api.service';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';


export const useInitialSetup = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();


    const setUpOnInitialLoad = async () => {
        const [assistants] = await Promise.all([getAllAssistantDataAppmodDb()]);
        if (assistants) {
            dispatch(setAssistants(assistants));
            const selectedAssistant = assistants?.[0];
            dispatch(setSourceAssistant(selectedAssistant));
        }
    };


    const { isFetching } = useQuery({
        queryKey: ['app-coding-standards-on-init', user?._id],
        queryFn: setUpOnInitialLoad,
        enabled: !!user?._id,
        refetchIntervalInBackground: true,
        staleTime: 12000,
        refetchOnWindowFocus: false
    });


    return { isFetching };
};