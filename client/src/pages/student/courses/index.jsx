import { useContext, useEffect, useState } from "react"
import { createSearchParams, useSearchParams } from "react-router-dom"
import { filterOptions, sortOptions } from "@/config"
import { getStudentCourses } from "@/services"
import { StudentContext } from "@/context/student"
import { ArrowUpDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuRadioGroup, 
    DropdownMenuRadioItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"


function StudentCoursesPage() {
    const { studentCourses, setStudentCourses } = useContext(StudentContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const [sort, setSort] = useState('price-low-high')
    const [filters, setFilters] = useState({})

    function handleFilterChange(section, option) {
        let copyFilters = {...filters}
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
        localStorage.setItem('filters', JSON.stringify(copyFilters))
    }

    async function getCourses() {
        const response = await getStudentCourses()
        
        if (response?.success) {
            setStudentCourses(response?.data)
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
        getCourses()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">
                All Courses
            </h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className="w-full md:w-64 space-y-4">
                    <div className="space-y-4">
                        { filterOptions && Object.keys(filterOptions).map(item => (
                            <div key={filterOptions[item].id} className="p-4 space-y-4">
                                <p className="font-semibold mb-3">
                                    { item.toUpperCase() }
                                </p>
                                <div className="grid gap-2 mt-2">
                                    { filterOptions[item].map(option => (
                                        <Label key={option.id} className="flex font-medium items-center gap-3">
                                            <Checkbox 
                                                checked={
                                                    filters
                                                    && Object.keys(filters).length > 0 
                                                    && filters[item]
                                                    && filters[item].indexOf(option.id) > -1
                                                }
                                                onCheckedChange={() => handleFilterChange(item, option)}
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
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <span className="text-gray-700">
                            10 Results
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
                        { studentCourses && studentCourses.length > 0 ? (
                            studentCourses.map(item => (
                                <Card key={item.id} className="cursor-pointer hover:shadow-md transition">
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
                                                { `${item.curriculum.length} ${item.curriculum.length <= 1 ? 'Lecture' : 'Lectures'}, ${item.level}` }  
                                            </p>
                                            <p className="text-lg font-semibold my-1">
                                                $ { item.price }  
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="items-center">
                                <h1>No courses found</h1>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentCoursesPage