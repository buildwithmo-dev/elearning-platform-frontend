import Nav from '../components/Nav';
// import ZoomScheduler from '../components/ZoomScheduler';
import Categories from '../components/Categories';
import CategorySection from '../components/CategorySection';
import Carousel from '../components/Carousel';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function LandingPage () {
    return(
        <div className="container-fluid">
            <Nav/>
            <Carousel/>
            <Categories/>
            <CategorySection/>
            <Reviews/>
            <FAQ/>
            {/* <ZoomScheduler/> */}
        </div>
    )
}