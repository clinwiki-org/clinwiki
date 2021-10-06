export const  INSERT_PAGE_VIEW_LOG =`
mutation InsertPageViewLog($userId:Int!, $url:String!) {
  insert_page_view_logs(objects: {user_id: $userId, url: $url } ) {
    returning {
      id
      url
      user_id
    }
  }
}
`
