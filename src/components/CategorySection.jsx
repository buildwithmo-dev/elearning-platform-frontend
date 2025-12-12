import {useState, useEffect} from 'react';
import axios from 'axios';

export default function CategorySection () {
    const api = "http://127.0.0.1:8000/api/courses/category-section"

    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategory = async () => {
            const res = axios.get(api)
            setCategory(res.data)
        }

        fetchCategory()
    }, [])
    return(
        <div className='container-fluid bg-secondary' style={{minHeight: '300px'}}>

            <div className="" >

            </div>
        </div>
    )
}