import { Button } from "../ui/button"
import FormControls from "./form-controls"


const CommonForm = ({ handleSubmit, buttonText, formControls = [], formData, setFormData, isButtonDisabled = false }) => {
    return (
      <form onSubmit={handleSubmit}>
          <FormControls 
            formControls={formControls} 
            formData={formData} 
            setFormData={setFormData} 
          />
          <Button type="submit" className="mt-5 w-full" disabled={isButtonDisabled}>
              { buttonText || 'Submit' }
          </Button>
      </form>
    )
}

export default CommonForm