import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function ArticlesForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    const testIdPrefix = "ArticlesForm";

    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="title">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-title"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Title is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="url">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-url"}
                    id="url"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("url", {
                        required: "Url is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("explanation", {
                        required: "Explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-email"}
                    id="email"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("email", {
                        required: "Email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateAdded">Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateAdded"}
                            id="dateAdded"
                            type="datetime-local"
                            isInvalid={Boolean(errors.localDateTime)}
                            {...register("dateAdded", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.localDateTime && 'DateAdded is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
            
            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default ArticlesForm;