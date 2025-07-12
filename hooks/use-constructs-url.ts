export function useConstructsUrl(key:string):string {
    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.fly.storage.tigris.dev/${key}`;
}