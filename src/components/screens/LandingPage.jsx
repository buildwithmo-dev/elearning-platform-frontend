import Nav from '../Nav';
import ZoomScheduler from '../ZoomScheduler';
import Categories from '../Categories';
import CategorySection from '../CategorySection';

// import Auth from '../Auth';
import VideoCarousel from '../VideoCarousel';

export default function LandingPage () {
    return(
        <div className="container-fluid">
            <Nav/>
            <VideoCarousel/>
            {/* <Auth/> */}
            <Categories/>
            <CategorySection/>
            <CategorySection/>
            <CategorySection/>
            <CategorySection/>
            <CategorySection/>
            <ZoomScheduler/>
        </div>
    )
}