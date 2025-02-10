import { Button } from "../ui/button"
import FormControls from "./form-controls"


const CommonForm = ({ handleSubmit, buttonText, formControls = [], formData, setFormData, isButtonDisabled = false }) => {
    return (
      <form onSubmit={handleSubmit}>
          <FormControls 
            formControls={formControls} 
            setFormData={setFormData} 
            formData={formData} 
          />
          <Button type="submit" className="mt-6 w-full" disabled={isButtonDisabled}>
              { buttonText || 'Submit' }
          </Button>
      </form>
    )
}

export default CommonForm