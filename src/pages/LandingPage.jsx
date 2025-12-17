import Nav from '../components/Nav';
import ZoomScheduler from '../components/ZoomScheduler';
import Categories from '../components/Categories';
import CategorySection from '../components/CategorySection';
import Carousel from '../components/Carousel';

export default function LandingPage () {
    return(
        <div className="container-fluid">
            <Nav/>
            <Carousel/>
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