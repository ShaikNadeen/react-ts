import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 650,
	bgcolor: '#1c1c1c',
	border: '2px solid #000',
	boxShadow: 24,
	p: 1
};
const inputStyle = { color: 'white', backgroundColor: '#2d2d2d', borderRadius: '8px', padding: '8px 16px', fontSize: '13px' };
const addNewTestCaseStyle = {
	color: '#005daa',
	marginBottom: '16px',
	textTransform: 'none',
	padding: 0,
	minWidth: 0,
	'&:hover': {
		backgroundColor: 'transparent'
	}
};
type TestCaseModalProps = {
	open: boolean;
	onClose: () => void;
};
const TestCaseModal: React.FC<TestCaseModalProps> = ({ open, onClose }) => {
	// const testCases=useSelector((state:RootState)=>state.testCases.testCases)
    const [inputFields,setInputFields]=useState(['','',''])
    const [testCases,setTestCases]=useState([])
	return (
		<>
			<div>
				<Modal open={open} onClose={onClose}>
					<Box className=" text-white rounded-lg shadow-lg mx-auto font-jakarta border-none" sx={style}>
							<div>
								<div className="flex flex-row justify-between">
									<div className="text-[16px] mb-2">Existing Test Cases</div>
									<CloseIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
								</div>
								{testCases.length <= 0 ? (
									<div style={{ display: 'flex', gap: '8px', margin: '5px 0 16px 0', borderBottom: '2px solid #a5a5a5' }}>
										<ErrorOutlineRoundedIcon style={{ color: '#a5a5a5', width: '18px', position: 'relative', top: '-2px', cursor: 'pointer' }} />
										<Typography sx={{ fontWeight: 400, fontSize: '14px', color: '#a5a5a5', lineHeight: '20px' }}>You have no test created. Start by creating new</Typography>
									</div>
								) : (
									<div className="flex flex-col mb-2 text-[14px] " style={{ borderBottom: '2px solid #a5a5a5' }}>
										{testCases.map((val, index) => (
											<div key={index} className="flex items-center gap-2 mb-2 cursor-pointer">
												<EditOutlinedIcon style={{ width: '15px' }} />
											</div>
										))}
									</div>
								)}
								<div className="text-[16px] mb-2 mt-2">Create a Test Case</div>
								<div>
									<div className="text-[13px] mb-2">Test Case Name</div>
									<TextField
										placeholder="Enter the test case name"
										className="w-full mb-2"
										InputProps={{ style: { color: 'white', backgroundColor: '#2d2d2d', borderRadius: '8px', padding: '8px 16px', fontFamily: 'Plus Jakarta Sans', fontSize: '13px' } }}
										inputProps={{ style: { padding: 0 } }}
									/>
								</div>

								<div className="text-[13px] mb-2">Input Method</div>
								<div className="mb-2 gap-3" defaultValue="input">
									<FormControlLabel value="input" control={<Radio style={{ color: '#025aa4' }} />} label="Input" />
									<FormControlLabel value="file" control={<Radio style={{ color: '#025aa4' }} />} label="File" disabled classes={{ disabled: 'text-white' }} />
								</div>
								<div className="flex mr-2 mb-2 gap-2 font-jakarta text-[14px] flex-wrap ">
									{inputFields?.map((field, index) => (
										<>
											<div>
												<div>{`Input field ${index + 1}`}</div>
												<TextField
													placeholder={`Enter input field ${index + 1}`}
													InputProps={{ style: inputStyle }}
													inputProps={{ style: { padding: 0 } }}
												/>
											</div>
										</>
									))}
								</div>
								<Button sx={addNewTestCaseStyle}>
									+ Add input field
								</Button>
								<div>
									<div>
										<div className="text-[14px]">Output Field:</div>
										<TextField
											placeholder="Enter the expected output"
											className="w-full mb-2 text-[10px]"
											InputProps={{ style: { color: 'white', backgroundColor: '#2d2d2d', borderRadius: '8px', padding: '8px 16px', fontSize: '13px' } }}
											inputProps={{ style: { padding: 0 } }}
										/>
									</div>
									<div className="text-[14px] mb-1">Input type</div>
									<FormControl className="w-full mb-2" style={{ color: 'white', backgroundColor: '#2d2d2d', borderRadius: '8px', fontSize: '13px', border: 'none' }}>
										<Select
											defaultValue="string"

											sx={{
												color: 'white',
												padding: 0,
												boxShadow: 'none',
												'.MuiOutlinedInput-notchedOutline': { border: 0 },
												'&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
													border: 0
												},
												'&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
													border: 0
												},
												fontSize: '13px'
											}}
											inputProps={{
												MenuProps: {
													MenuListProps: {
														sx: {
															backgroundColor: '#2d2d2d',
															color: 'white'
														}
													}
												}
											}}
										>
											<MenuItem value="integer" className="text-[13px]">
												Integer
											</MenuItem>
											<MenuItem value="string" className="text-[13px]">
												String
											</MenuItem>
											<MenuItem value="boolean" className="text-[13px]">
												Boolean
											</MenuItem>
										</Select>
									</FormControl>
								</div>

								<Button sx={addNewTestCaseStyle}>
									+Create new
								</Button>
								<div className="flex justify-end gap-2">
									<Button variant="outlined" color="primary" onClick={onClose} >
										Cancel
									</Button>
									<Button variant="contained" color="primary" onClick={onClose}>
										Save
									</Button>
								</div>
							</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};
export default TestCaseModal;
 