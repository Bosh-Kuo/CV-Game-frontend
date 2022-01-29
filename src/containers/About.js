import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Layout from '../components/Layout/Layout';
const About = () => {
    return (
        <Layout>
        <Container component="main" sx={{ mt: 8, mb: 2 }} >
            <Typography variant="h2" component="h1" gutterBottom>
                About this project
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                {'The main idea of this project is about combining computer vision technology with web game. We use the deep learning model to do real-time prediction of your pose, hand sign, etc. \
                Than use it to design our game.' }<br/>
                {'The main deep learning libary we use is Tensorflow.js. It\'s a powerful and convenient open source libary.'}<br/>
            </Typography>
            <Typography variant="body2">If you have any further questions or recommend, please don't hesitate to contact us ! </Typography>
        </Container>
        </Layout>
    )
}

export default About