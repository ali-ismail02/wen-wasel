
const moveTo = async (position, mapRef) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
        camera.center = position;
        mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
}

const centerScreen = (origin, destination, mapRef) => {
    mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        animated: true,
    });
}

export { moveTo, centerScreen };