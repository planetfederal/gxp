CREDENTIALS=$1
GIT_BRANCH=$2

cd build

DIRS=$(find doc script examples -type d)
FILES=$(find doc script examples type f)
REPO=http://gxp.opengeo.org/

curl -u $CREDENTIALS -X MKCOL "${REPO}${GIT_BRANCH}"

for DIR in $DIRS; do
  curl -u $CREDENTIALS -X MKCOL "${REPO}${GIT_BRANCH}/${DIR}"
done

for FILE in $FILES; do
  curl -u $CREDENTIALS -T $FILE "${REPO}${GIT_BRANCH}/${FILE}"
done
