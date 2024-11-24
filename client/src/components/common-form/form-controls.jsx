import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


const FormControls = ({ formControls = [], formData, setFormData }) => {

    function renderComponentByType(item) {
        let element = null

        switch(item.componentType) {
            case 'input':
                element = 
                    <Input 
                        id={item.name}
                        name={item.name}
                        type={item.type}
                        placeholder={item.placeholder}
                    />
                break
            case 'select':
                element = 
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={item.label} />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                item.options && item.options.length > 0
                                ? item.options.map(option => (
                                    <SelectItem key={option.id} value={item.id}>
                                        { option.label }
                                    </SelectItem>
                                ))
                                : null
                            }
                        </SelectContent>
                    </Select>
                break
            case 'textarea':
                element = 
                    <Textarea 
                        id={item.name}
                        name={item.name}
                        placeholder={item.placeholder}
                    />
                break
            default:
                element = 
                    <Input 
                        id={item.name}
                        name={item.name}
                        type={item.type}
                        placeholder={item.placeholder}
                    />
                break
        }
        return element
    }

    return (
        <div className="flex flex-col gap-3">
            {
                formControls.map(item => (
                    <div key={item.name}>
                        <Label htmlFor={item.name} className="ml-0.5">
                            { item.label }
                        </Label>
                        { renderComponentByType(item) }
                    </div>
                ))
            }
        </div>
    )
}

export default FormControls