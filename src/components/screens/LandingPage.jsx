import Nav from '../Nav';
import ZoomScheduler from '../ZoomScheduler';
// import Auth from '../Auth';
import VideoCarousel from '../VideoCarousel';

export default function LandingPage () {
    return(
        <>
            <Nav/>
            <VideoCarousel/>
            {/* <Auth/> */}
            <ZoomScheduler/>
        </>
    )
}