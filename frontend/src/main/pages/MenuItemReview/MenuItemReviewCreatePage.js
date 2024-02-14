import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

  const objectToAxiosParams = (review) => ({
    url: "/api/menuitemreview/post",
    method: "POST",
    params: {
     id: review.id,
     itemId: review.itemId,
     reviewerEmail: review.reviewerEmail,
     stars: review.stars,
     dateReviewed: review.dateReviewed,
     comments: review.comments
    }
  });

  const onSuccess = (review) => {
    toast(`New review Created - id: ${review.id} itemId: ${review.itemId}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/menuitemreview/all"] // mutation makes this key stale so that pages relying on it reload
     );

     const { isSuccess } = mutation

     const onSubmit = async (data) => {
       mutation.mutate(data);
     }
   
     if (isSuccess && !storybook) {
       return <Navigate to="/menuitemreview" />
     }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}