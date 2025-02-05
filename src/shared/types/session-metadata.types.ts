export interface LocationInfo {
	country: string
	city: string
	latitude: number
	longitude: number
}

export interface DeviceInfo {
	browser: string | undefined
	os: string | undefined
	type: string | undefined
}

export interface SessionMetadata {
	location: LocationInfo
	device: DeviceInfo
	ip: string | undefined
}
