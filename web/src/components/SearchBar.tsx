import React, { useState } from 'react'
import { InputBase, Box, IconButton } from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'

const SearchBar = () => {

    const [searchValue, setSearchValue] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    const handleClear = () => setSearchValue('')

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50px',
                backgroundColor: '#363D45',
                padding: '0.5rem',
                paddingLeft: '1rem',
                width: '80%',
                margin: '2rem auto',    // TODO fix 2rem
                color: '#848484',
            }}
        >
            <SearchIcon />
            <InputBase
                value={ searchValue }
                onChange={ handleChange }
                placeholder="Search"
                sx={{
                    marginLeft: '0.5rem',
                    flexGrow: 1,
                    color: 'white',
                }}
            />
            {/* If there are some text in the search bar, show cross that can delete all that text */}
            {
                searchValue && (
                    <IconButton onClick={ handleClear } size="small">
                        <ClearIcon sx={{ color: '#848484' }} />
                    </IconButton>
                )
            }
        </Box>
    )
}

export default SearchBar