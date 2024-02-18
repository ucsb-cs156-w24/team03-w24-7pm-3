import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks
    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
    // Stryker disable next-line Regex
    const email_regex = /[A-Za-z0-9]+@[A-Za-z]{3,}/i;
    

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">id</Form.Label>
                            <Form.Control
                                data-testid="HelpRequestForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}
            </Row>
            <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requesterEmail">RequesterEmail</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-RequesterEmail"
                            id="requesterEmail"
                            type="text"
                            isInvalid={Boolean(errors.requesterEmail)}
                            {...register("requesterEmail", { required: true , pattern: email_regex})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.requesterEmail?.type === 'pattern' && 'requesterEmail must be a valid email'}
                            {errors.requesterEmail && 'RequesterEmail is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="teamId">teamId</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-teamId"
                            id="teamId"
                            type="text"
                            isInvalid={Boolean(errors.teamId)}
                            {...register("teamId", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.teamId && 'teamId is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="requestTime">requestTime</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-requestTime"
                            id="requestTime"
                            type="datetime-local"
                            isInvalid={Boolean(errors.requestTime)}
                            {...register("requestTime", { required: 'requestTime is required.', pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                             {errors.requestTime?.message}               
                             {/* {errors.requestTime?.type === 'pattern' && 'requestTime must be in ISO format'} */}
                            
                        </Form.Control.Feedback>
                        
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="tableOrBreakoutRoom">tableOrBreakoutRoom</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-tableOrBreakoutRoom"
                            id="tableOrBreakoutRoom"
                            type="text"
                            isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                            {...register("tableOrBreakoutRoom", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.tableOrBreakoutRoom && 'tableOrBreakoutRoom is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
                
            <Row>
                <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="solved">Solved</Form.Label>
                            <Form.Check
                                data-testid="HelpRequestForm-solved"
                                id="solved"
                                type="switch"
                                {...register("solved")}
                            />
                        </Form.Group>
                    </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="explanation">explanation</Form.Label>
                        <Form.Control
                            data-testid="HelpRequestForm-explanation"
                            id="explanation"
                            type="text"
                            isInvalid={Boolean(errors.explanation)}
                            {...register("explanation", { required: true})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.explanation && 'explanation is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="HelpRequestForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="HelpRequestForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
        
    )
}

export default HelpRequestForm;
