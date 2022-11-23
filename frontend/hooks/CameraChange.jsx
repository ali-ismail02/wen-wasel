
const moveTo = async (position, mapRef, altitude = null) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
        camera.center = position;
        if (altitude != null) {
            camera.zoom = altitude;
        }
        mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
}

const centerScreen = (origin, destination, mapRef, top = 30) => {
    mapRef.current?.fitToCoordinates([origin, destination], {
        edgePadding: { top: top, right: 30, bottom: 200, left: 30 },
        animated: true,
    });
}

export { moveTo, centerScreen };
