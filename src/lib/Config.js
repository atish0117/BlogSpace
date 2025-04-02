const  Config ={
appwriteUrl:String(import.meta.env.VITE_ENDPOINT),
appwriteProjectId:String(import.meta.env.VITE_PROJECT_ID),
appwriteDatabaseId:String(import.meta.env.VITE_DATABASE_ID),
appwriteCollectionIdBlogs:String(import.meta.env.VITE_BLOGS_COLLECTION_ID),
appwriteCollectionIdUsers:String(import.meta.env.VITE_USERS_COLLECTION_ID),
appwriteCollectionIdComments:String(import.meta.env.VITE_COMMENTS_COLLECTION_ID),
appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}

export default Config