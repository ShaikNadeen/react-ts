import React, { ReactNode, useState } from 'react';


import FlexContainer from '@/shared/components/templates/flex-container';
import { Sidebar } from '../admin/components/admin-sidebar';
import { useAppStore } from '@/hooks/redux-state';
import CodeWorkspaceContainer from '@/shared/components/code-workspace-container/code-workspace-container.component';

type PublicLayoutProps = {
  children?: ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [isCustomerTestEnabled, setIsCustomerTestEnabled] = useState(false);
	const {isSideBarCollapsed} = useAppStore((state) => state.app.layout);

  return (
    <div className="h-screen w-[100vw]">
      <FlexContainer className="flex gap-4 bg-slate-100 p-4 min-h-screen flex-row max-w-screen">
        <Sidebar className="w-24 h-full text-white" />
        
          <CodeWorkspaceContainer isSidebarCollapsed={isSideBarCollapsed} setCustomerTest={setIsCustomerTestEnabled} customerTest={isCustomerTestEnabled} />

            {/* {children || <Outlet />} */}
         
      </FlexContainer>
    </div>
  );
};

export default PublicLayout;
