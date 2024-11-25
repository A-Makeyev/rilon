import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


const FormControls = ({ formControls = [], formData, setFormData }) => {

    function renderComponentByType(item) {
        let element = null
        const currentValue = formData[item.name] || ''

        switch(item.componentType) {
            case 'input':
                element = 
                    <Input 
                        id={item.name}
                        name={item.name}
                        type={item.type}
                        placeholder={item.placeholder}
                        value={currentValue}
                        onChange={(e) => setFormData({
                            ...formData,
                            [item.name] : e.target.value
                        })}
                    />
                break
            case 'select':
                element = 
                    <Select 
                        value={currentValue}
                        onValueChange={(val) => setFormData({
                        ...formData,
                        [item.name] : val
                    })}
                    >
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
                        value={currentValue}
                        onChange={(e) => setFormData({
                            ...formData,
                            [item.name] : e.target.value
                        })}
                    />
                break
            default:
                element = 
                    <Input 
                        id={item.name}
                        name={item.name}
                        type={item.type}
                        placeholder={item.placeholder}
                        value={currentValue}
                        onChange={(e) => setFormData({
                            ...formData,
                            [item.name] : e.target.value
                        })}
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