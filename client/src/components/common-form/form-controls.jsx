import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


function FormControls({ formControls = [], formData, setFormData }) {
  function renderComponentByType(item) {
    let element = null
    const currentControlItemValue = formData[item.name] || ''

    switch (item.componentType) {
      case 'input':
        element = (
            <Input
                id={item.name}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={currentControlItemValue}
                onChange={(event) => setFormData({
                    ...formData,
                    [item.name]: event.target.value,
                })}
            />
        )
        break

      case 'select':
        element = (
            <Select
                value={currentControlItemValue}
                onValueChange={(value) => setFormData({
                    ...formData,
                    [item.name]: value,
                })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={item.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    { item.options && item.options.length > 0 &&
                        item.options.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                                { option.label }
                            </SelectItem>
                        )
                    )}
                </SelectContent>
            </Select>
        )
        break

      case 'textarea':
        element = (
            <Textarea
                id={item.name}
                name={item.name}
                placeholder={item.placeholder}
                value={currentControlItemValue}
                className="h-20 max-h-60"
                onChange={(event) => setFormData({
                    ...formData,
                    [item.name]: event.target.value,
                })}
            />
        )
        break

      default:
        element = (
            <Input
                id={item.name}
                name={item.name}
                type={item.type}
                placeholder={item.placeholder}
                value={currentControlItemValue}
                onChange={(event) => setFormData({
                    ...formData,
                    [item.name]: event.target.value,
                })}
            />
        )
        break
    }

    return element
  }

    return (
        <div className="flex flex-col gap-3">
            { formControls.map((controleItem) => (
                <div key={controleItem.name}>
                    <Label htmlFor={controleItem.name} className="ml-1">
                        { controleItem.label }
                    </Label>
                    <div className="mt-2">
                        { renderComponentByType(controleItem) }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FormControls