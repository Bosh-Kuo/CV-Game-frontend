import { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../containers/App";
import { useContext } from "react";

const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Header = ({ open, setOpen, toggleSideBar }) => {
    const [anchorElNav, setAnchorElNav] = useState(null)
    const [anchorElUser, setAnchorElUser] = useState(null)
    const navigate = useNavigate();
    const { UserData, handleLogout, handleSignUp } = useContext(UserContext);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="absolute" open={open}>
            <Toolbar sx={{ pr: '24px' }}>
                {/* 選單鈕 */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSideBar}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }), // open為false時MenuIcon會消失
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Header標題文字 */}
                <Typography
                    variant="h5" sx={{ flexGrow: 1 }}
                    color="inherit" noWrap  //沒有也沒差
                >
                    Computor Vision Game Playground
                </Typography>

                {/* Router Button */}
                <Box sx={{ flexGrow: 0.2, display: { xs: 'none', md: 'flex' } }}>
                    <Button
                        key={"Home"}
                        onClick={() => { navigate(`/login/${UserData.username}/lobby`) }}
                        sx={{ fontSize: 20, color: 'inherit', display: 'block' }}
                    >
                        {"Home"}
                    </Button>
                    <Button
                        key={"About"}
                        onClick={() => { navigate(`/login/${UserData.username}/about`) }}
                        sx={{ fontSize: 20, color: 'inherit', display: 'block' }}
                    >
                        {"About"}
                    </Button>
                </Box>

                {/* UserIcon */}
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title={`${UserData.username}`}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <AccountCircleRoundedIcon sx={{ fontSize: "30px" }} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '30px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem key={"Log Out"} onClick={handleLogout}>
                            <Typography textAlign="center">{"Log Out"}</Typography>
                        </MenuItem>
                        <MenuItem key={"Sign Up"} onClick={handleSignUp}>
                            <Typography textAlign="center">{"Sign Up"}</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar >


    )
}

export default Header;