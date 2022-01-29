import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link'

const Footer = () => {
    return (
        <Box px={{ xs: 3, sm: 8 }}
            py={{ xs: 3, sm: 5 }}
            bgcolor="text.secondary"
            color="white"
            component="footer"
            sx={{
                // mt: 20,
                
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={10} sm={4}>
                        <Box borderBottom={1}>Author</Box>
                        <Box>
                            <Link href="https://github.com/Bosh-Kuo" underline='hover' color="inherit">郭柏志 Bosh-Kuo</Link>
                        </Box>
                        <Box>
                            <Link href="https://github.com/feidon" underline='hover' color="inherit">費聿喧 Yu-Hsuan Fei</Link>
                        </Box>
                        <Box>
                            <Link href="https://github.com/b06901089" underline='hover' color="inherit">蔡予謙 Yu-Chien Tsai</Link>
                        </Box>
                    </Grid>
                    <Grid item xs={10} sm={4}>
                        <Box borderBottom={1}>Contact</Box>
                        <Box>
                            <Typography color="inherit">r09521205@ntu.edu.tw</Typography>
                        </Box>
                        <Box>
                            <Typography color="inherit">r09521515@ntu.edu.tw</Typography>
                        </Box>
                        <Box>
                            <Typography color="inherit">b06901089@ntu.edu.tw</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={10} sm={4}>
                        <Box borderBottom={1}>Reference</Box>
                        <Box>
                            <Link href="https://www.facebook.com/groups/133408567007072" underline='hover' color="inherit">Web Programming 2021-Fall</Link>

                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box >
    )
}

export default Footer