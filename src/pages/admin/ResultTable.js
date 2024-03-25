import { Table, TableHead, TableRow, TableCell, Pagination, TableBody, IconButton,TextField } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useState } from 'react';

export default function ResultTable(props) {
    const [editingItem,setEditingItem] = useState()
    let tableHeaders = null;
    switch (props.tab) {
        case 'User':
            tableHeaders = ['id', 'name', 'role', 'email']

    }
    console.log(tableHeaders);
    // console.log(tab);
    console.log('Hello world🔔');
    return (<div>
        {editingItem?<div className='editForm'>
            {Object.keys(editingItem).map((key)=>(<TextField
          id={key}
          key={key}
          label={key}
          variant='filled'
          defaultValue={editingItem[key]}
          sx={{padding:1}}
        />))}
        </div>
            :<div><Table>
            <TableHead >
                <TableRow>
                    {tableHeaders.map((headerName) => { return (<TableCell key={headerName}>{headerName}</TableCell>) })}
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.result.results.map((res, index) => (<TableRow key={index}>
                    {tableHeaders.map((headerName) => (<TableCell key={index + headerName}>{res[headerName]}</TableCell>))}
                    <TableCell>
                    <IconButton aria-label="edit" onClick={()=>setEditingItem(res)}>
                            <EditRoundedIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
                            <DeleteRoundedIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>))}
            </TableBody>
        </Table>
        <div><Pagination count={props.result.totalPages} page={props.result.page} onChange={props.onPageChange} /></div>
        </div>}
    </div>)
}