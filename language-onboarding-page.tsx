import { searchIconProjectanalyser } from '@/assets/svg';
import { updateOnboardingMode } from '@/redux/slices/langauge-onboarding-new.slice';
import { Button } from '@/shared/components/atomic-components/button';
import { InputCustom } from '@/shared/components/shadcn-components/ui/input.custom';
import { TypographyP } from '@/shared/components/shadcn-components/ui/typography.component';
import { useTypedDispatch, useTypedSelector } from '@/shared/hooks';
import useDebounce from '@/shared/hooks/useDebounce';
import { Menu, MenuItem } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyStateCard } from '../user-mode/project-analysis/components/empty-card-component';
import { LanguageOnboardingDashboardSkeleton } from '../user-mode/project-analysis/views/components/skelatons';
import LanguageOnboardingCard from './components/language-onbaording-language-card';
import { useGetAllLanguages } from './mutation';

export default function LanguageOnboardingDashboard() {
  const dispatch = useTypedDispatch();
  const { onboardingMode,assistantUnitTestingInfo,assistantInformation } = useTypedSelector((state) => state?.newLanguageOnboardingSlice) ?? {};
  const { languageName } = assistantInformation ?? {};
  const { compilerInfo } = assistantUnitTestingInfo ?? {};
  const { selectedCompiler } = compilerInfo ?? {};
  const navigate = useNavigate();
  const searchParameters = new URLSearchParams(location.search);
  const initialSearchTerm = searchParameters.get('searchTerm') ?? '';
  const {data,isLoading}=useGetAllLanguages()
  const sortedData=data?.sort((a,b)=>a.language.localeCompare(b.language))
  const [searchForExistingProjects, setSearchForExistingProjects] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  
  const redirectToCreationPage = (mode:string) => {
    navigate(`/language-onboarding/create?onboardingMode=${encodeURIComponent(mode)}`)
  }
  const debouncedSetSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value);
    const newSearchParameters = new URLSearchParams(location.search);
    if (value) {
      newSearchParameters.set('searchTerm', value);
    } else {
      newSearchParameters.delete('searchTerm');
    }
    navigate(`${location.pathname}?${newSearchParameters.toString()}`, { replace: true });
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForExistingProjects(event.target.value);
    debouncedSetSearch(event.target.value);
  };

  const filteredProjects = useMemo(() => 
    sortedData?.filter(project =>
      project.language.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ),
    [sortedData, debouncedSearchTerm]
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleOnboardExisting = useCallback(() => {
    dispatch(updateOnboardingMode('existing-language'))
    redirectToCreationPage('existing-language');
    handleClose();
  },[dispatch])

  const handleOnboardNew = useCallback(() => {
    dispatch(updateOnboardingMode('new-language'))
    redirectToCreationPage('new-language');
    handleClose();
  },[dispatch])

  const renderContent=()=>{
    if (isLoading) {
      return <LanguageOnboardingDashboardSkeleton />;
    }
    if (filteredProjects?.length === 0) {
      return (
        <EmptyStateCard
          title="No matching Languages found"
          description="Try adjusting your search or onboard a new Language."
        />
      );
    }
  if((filteredProjects ?? []).length > 0){
return  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center content-start mb-4 gap-3  auto-rows-min grid-flow-row-dense">
{filteredProjects?.map((project) => (
  <LanguageOnboardingCard
    key={project.language}
    languageName={project.language}
    running_compilers={project.compilers_active_count}
    inactive_compilers={project.compilers_inactive_count}
    totalAssistantCount={project.assistants}
  />
))}
</div>
    }
  }

  return (
    <>
    <div className="mx-8 font-jakarta">
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-3">
          <div className="relative w-72">
            <InputCustom
              placeholder="Search Languages"
              type="text"
              value={searchForExistingProjects}
              onChange={handleSearchChange}
              className="pl-10"
            />
								<img src={searchIconProjectanalyser} alt="" className='absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4' />
          </div>
          <Button
            variant="default"
            onClick={handleClick}
            className="flex items-center rounded-full"
          >
            <TypographyP>Onboard Language</TypographyP>
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Menu
            anchorEl={anchorElement}
            open={Boolean(anchorElement)}
            onClose={handleClose}
						className='mt-1'
          >
            <MenuItem onClick={handleOnboardExisting}>
						<TypographyP className='opacity-90'>
              Onboard Existing Language
						</TypographyP>
            </MenuItem>
            <MenuItem onClick={handleOnboardNew}>
						<TypographyP className='opacity-90'>
              Onboard New Language
						</TypographyP>
            </MenuItem>
          </Menu>
        </div>
      </div>
      {renderContent()}
     
    </div>
    </>
  );
}