export function createResolver(
    root,
    resolvers,
    userAlias,
    assetsInclude
) {
    const resolver = {
        isAssetRequest (filePath) {
            return (
                (assetsInclude && assetsInclude(filePath)) || isStaticAsset(filePath)
            )
        }
    }
}