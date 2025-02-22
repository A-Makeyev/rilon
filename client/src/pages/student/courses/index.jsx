import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { filterOptions, sortOptions } from "@/config"
import { getCoursePurchaseInfo, getStudentCourses } from "@/services"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowUpDownIcon, ScrollText } from "lucide-react"
import { adjustPrice } from "@/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"


function StudentCoursesPage() {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { 
        studentCourses, 
        setStudentCourses, 
        loading, 
        setLoading 
    } = useContext(StudentContext)
    const [filters, setFilters] = useState(JSON.parse(sessionStorage.getItem('filters')) || {})
    const [searchParams, setSearchParams] = useSearchParams()
    const [sort, setSort] = useState('price-low-high')


    async function handleCourseNavigation(id) {
        const response = await getCoursePurchaseInfo(id, auth?.user?._id)
        if (response?.success) {
            navigate(response?.data ? `/course-progress/${id}` : `/course/details/${id}`)
        }
    }
    
    function handleFilterChange(section, option) {
        let copyFilters = { ...filters }
        const sectionValues = copyFilters[section] || []

        if (!sectionValues.includes(option.id)) {
            copyFilters[section] = [...sectionValues, option.id]
        } else {
            copyFilters[section] = sectionValues.filter(id => id !== option.id)
        }

        if (copyFilters[section].length === 0) {
            delete copyFilters[section]
        }

        setFilters(copyFilters)
    }

    async function getCourses(filters, sort) {
        if (!filters || !sort) return

        setLoading(true)
        
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort
        })
        
        const response = await getStudentCourses(query)

        if (response?.data) {
            setStudentCourses(response.data)
        }
        setLoading(false)
    }

    function updateSearchParams(filterParams) {
        if (!filterParams) return
        
        const params = Object.entries(filterParams)
            .filter(([_, value]) => Array.isArray(value) && value.length > 0)
            .map(([key, value]) => [key, value.join(',')])

        setSearchParams(new URLSearchParams(params))
        return Object.fromEntries(searchParams)
    }

    useEffect(() => {
        getCourses(filters, sort)
    }, [filters, sort])

    useEffect(() => {
        sessionStorage.setItem('filters', JSON.stringify(filters))
        updateSearchParams(filters)
    }, [filters])

    useEffect(() => {
        return () => {
            sessionStorage.removeItem('filters')
        }
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">
                All Courses
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64">
                    <div>
                        { filterOptions && Object.keys(filterOptions).map(item => (
                            <div key={item} className="p-4 space-y-4">
                                <p className="font-semibold mb-3">
                                    { item.toUpperCase() }
                                </p>
                                <div className="grid gap-2 mt-2">
                                    { filterOptions[item].map(option => (
                                        <Label key={option.id} className="flex font-medium items-center gap-3">
                                            <Checkbox
                                                onCheckedChange={() => handleFilterChange(item, option)}
                                                checked={
                                                    filters
                                                    && Object.keys(filters).length > 0
                                                    && filters[item]
                                                    && filters[item].indexOf(option.id) > -1
                                                }
                                            />
                                            { option.label }
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="flex justify-end items-center mb-4 gap-4">
                        <span className="text-gray-700">
                            { studentCourses.length ? `${studentCourses.length} ${studentCourses.length === 1 ? 'Result' : 'Results'}` : null }
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <ArrowUpDownIcon className="w-4 h-4" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    { sortOptions && sortOptions.map(item => (
                                        <DropdownMenuRadioItem key={item.id} value={item.id} className="cursor-pointer">
                                            { item.label }
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="space-y-4">
                        { loading ? (
                            <div className="flex justify-center">
                                <LoadingSpinner className="mt-40 w-12 h-12" />
                            </div>
                        ) : studentCourses && studentCourses.length > 0 ? (
                            studentCourses.map(item => (
                                <Card
                                    key={item._id}
                                    className="hover:shadow-lg duration-300"
                                >
                                    <CardContent className="flex gap-4 p-4 cursor-default">
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img 
                                                alt={item.title}
                                                src={item.image_url} 
                                                onClick={() => handleCourseNavigation(item._id)} 
                                                className="w-full h-full object-cover cursor-pointer" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle 
                                                onClick={() => handleCourseNavigation(item._id)} 
                                                className="text-lg font-semibold my-1 cursor-pointer hover:text-gray-700"
                                            >
                                                { item.title }
                                            </CardTitle>
                                            <p className="text-base font-semibold text-gray-700">
                                                Created by {' '}
                                                <span className="cursor-pointer text-gray-700 hover:text-gray-500 transition">
                                                    { item.instructorName }
                                                </span>
                                            </p>
                                            <p className="flex flex-row text-base font-semibold capitalize text-gray-700">
                                                <ScrollText className="w-4 h-4 mt-1 mr-1" />
                                                {`${item.curriculum.length} ${item.curriculum.length <= 1 ? 'Lecture' : 'Lectures'}, ${item.level}`}
                                            </p>
                                            <p className="text-lg font-semibold font-mono my-1">
                                                { adjustPrice(item.price) }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center font-medium text-xl mt-20">
                                <h1>No Courses Found</h1>
                                <h1>¯\_(ツ)_/¯</h1>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentCoursesPage