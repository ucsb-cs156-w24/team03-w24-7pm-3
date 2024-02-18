import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {

 const objectToAxiosParams = (recommendationRequest) => ({
   url: "/api/recommendationrequest/post",
   method: "POST",
   params: {
    requesterEmail: recommendationRequest.requesterEmail,
    professorEmail: recommendationRequest.professorEmail,
    explanation: recommendationRequest.explanation,
    dateRequested: recommendationRequest.dateRequested,
    dateNeeded: recommendationRequest.dateNeeded,
    done: recommendationRequest.done

   }
 });

 const onSuccess = (recommendationRequest) => {
   toast(`New RecommendationRequest Created - id: ${recommendationRequest.id}`);
 }

 const mutation = useBackendMutation(
   objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendationrequest/all"] // mutation makes this key stale so that pages relying on it reload
    );

 const { isSuccess } = mutation

 const onSubmit = async (data) => {
   mutation.mutate(data);
 }

 if (isSuccess && !storybook) {
   return <Navigate to="/api/recommendationrequest" />
 }

 return (
   <BasicLayout>
     <div className="pt-2">
       <h1>Create New Recommendation Request</h1>

       <RecommendationRequestForm submitAction={onSubmit} />
       
     </div>
   </BasicLayout>
 )
}