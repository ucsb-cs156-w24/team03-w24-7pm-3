import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    const email_regex = /.*@.*/i;

    return (

        <Form onSubmit={handleSubmit(submitAction)}>
            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="MenuItemReviewForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="itemId">Menu Item ID</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-itemId"
                    id="itemId"
                    type="text"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("itemId", {
                        required: "Item Id is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.itemId?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">Email</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-reviewerEmail"
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.reviewerEmail)}
                    {...register("reviewerEmail", {
                        required: true,
                        pattern: email_regex
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.type === 'required' && 'Email is required.'}
                    {errors.reviewerEmail?.type === 'pattern' && '@ is required in an email'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="stars">Stars</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-stars"
                    id="stars"
                    type="text"
                    isInvalid={Boolean(errors.stars)}
                    {...register("stars", {
                        required: true,
                        max : 5,
                        min : 1
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stars?.type === 'required' && 'Stars are required.'}
                    {errors.stars?.type === 'max' && 'Max rating of 5 stars'}
                    {errors.stars?.type === 'min' && 'Min rating of 1 stars'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="dateReviewed">Date (iso format)</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-dateReviewed"
                    id="dateReviewed"
                    type="datetime-local"
                    isInvalid={Boolean(errors.dateReviewed)}
                    {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.dateReviewed && 'Date Reviewed is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">Comments</Form.Label>
                <Form.Control
                    data-testid="MenuItemReviewForm-comments"
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.comments)}
                    {...register("comments", {
                        required: "Comments are required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="MenuItemReviewForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="MenuItemReviewForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MenuItemReviewForm;
