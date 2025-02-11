import { useContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AuthContext } from "@/context/auth"
import { StudentContext } from "@/context/student"
import { filterOptions, sortOptions } from "@/config"
import { getCoursePurchaseInfo, getStudentCourses } from "@/services"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowUpDownIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { LoadingSpinner } from "@/components/ui/loading-spinner"


function StudentCoursesPage() {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)
    const { studentCourses, setStudentCourses, loading, setLoading } = useContext(StudentContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [sort, setSort] = useState('price-low-high')
    const [filters, setFilters] = useState({})

    function handleFilterChange(section, option) {
        let copyFilters = { ...filters }
        let currentSectionIndex = Object.keys(copyFilters).indexOf(section)

        if (currentSectionIndex === -1) {
            copyFilters = {
                ...copyFilters,
                [section]: [option.id]
            }
        } else {
            const currentOptionIndex = copyFilters[section].indexOf(option.id)

            if (currentOptionIndex === -1) {
                copyFilters[section].push(option.id)
            } else {
                copyFilters[section].splice(currentOptionIndex, 1)
            }
        }
        setFilters(copyFilters)
        sessionStorage.setItem('filters', JSON.stringify(copyFilters))
    }

    async function getCourses(filters, sort) {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort
        })

        const response = await getStudentCourses(query)

        if (response?.success) {
            setStudentCourses(response?.data)
            setLoading(false)
        }
    }

    async function handleCourseNavigation(id) {
        const response = await getCoursePurchaseInfo(id, auth?.user?._id)

        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${id}`)
            } else {
                navigate(`/course/details/${id}`)
            }
        }
    }

    function createSearchParams(filterParams) {
        const params = []

        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                const paramsValue = value.join(',')
                params.push(`${key}=${encodeURIComponent(paramsValue)}`)
            }
        }
        return params.join('&')
    }

    useEffect(() => {
        const query = createSearchParams(filters)
        setSearchParams(new URLSearchParams(query))
    }, [filters])

    useEffect(() => {
        if (filters !== null && sort !== null) {
            getCourses(filters, sort)
        }
    }, [filters, sort])

    useEffect(() => {
        setSort('title-a-z')
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    }, [])

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
                        {filterOptions && Object.keys(filterOptions).map((item, index) => (
                            <div key={index} className="p-4 space-y-4">
                                <p className="font-semibold mb-3">
                                    { item.toUpperCase() }
                                </p>
                                <div className="grid gap-2 mt-2">
                                    {filterOptions[item].map(option => (
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
                                            {option.label}
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
                                    {sortOptions && sortOptions.map((item, index) => (
                                        <DropdownMenuRadioItem key={index} value={item.id} className="cursor-pointer">
                                            { item.label }
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center">
                                <LoadingSpinner className="mt-40 w-12 h-12" />
                            </div>
                        ) : studentCourses && studentCourses.length > 0 ? (
                            studentCourses.map(item => (
                                <Card
                                    key={item._id}
                                    onClick={() => handleCourseNavigation(item._id)}
                                    className="cursor-pointer hover:shadow-md transition"
                                >
                                    <CardContent className="flex gap-4 p-4">
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img src={item.image_url} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold my-1">
                                                { item.title }
                                            </CardTitle>
                                            <p className="text-base font-semibold text-gray-700">
                                                Created by {' '}
                                                <span className="cursor-pointer text-blue-700 hover:text-blue-500 transition">
                                                    { item.instructorName }
                                                </span>
                                            </p>
                                            <p className="text-base font-semibold text-gray-700">
                                                {`${item.curriculum.length} ${item.curriculum.length <= 1 ? 'Lecture' : 'Lectures'}, ${item.level}`}
                                            </p>
                                            <p className="text-lg font-semibold my-1">
                                                { item.price }$
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