import { useState } from "react";
import TestCaseModal from "./popup";
import { Button } from "@mui/material";

const Home: React.FC = () => {
    const [isModalOpen,setIsModalOpen]=useState(false);
    const handleOpenModal=()=>{
        setIsModalOpen(true);
    }
    const handleCloseModal=()=>{
        setIsModalOpen(false)
    }
    return (
      <>
      <Button variant="outlined" className="rounded-lg" onClick={handleOpenModal}>open popup</Button>
      <TestCaseModal open={isModalOpen} onClose={handleCloseModal}/>
      </>
    );
  };
  
  export default Home;