mkdir ./build

# The copy method below throws an error regarding recursive copying when executed. Switched to rsync to avoid, but left the old command in for review.
# cp ./* ./build -r

rsync -av --exclude './build' ./* ./build
cp "$(which node)" ./build/
rm ./build/build.sh
