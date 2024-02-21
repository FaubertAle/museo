const vertexShader2 = `
varying vec2 vUv;

void main(){
	vUv = uv;
	gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}
`;

const fragmentShader2 = `
varying vec2 vUv;
uniform float time;
//uniform vec2 UVOffset;
//uniform vec3 InColor;
//uniform float scale;

vec3 GetCol(vec2 uv)
{
	const vec2 vp = vec2(40.0);
	float t = time * .02;
    vec2 p0 = (uv - 0.5) * vp;
    vec2 hvp = vp * 0.5;
	vec2 p1d = vec2(cos( t / 9.0),  sin( t / 3.0)) * hvp - p0;
	vec2 p2d = vec2(sin(-t / 14.0), cos(-t / 4.0)) * hvp - p0;
	vec2 p3d = vec2(cos(-t / 15.0), cos( t / 5.0))  * hvp - p0;
    float sum = 0.5 + 0.5 * (
		cos(length(p1d) / 3.0) +
		cos(length(p2d) / 12.0) +
		sin(length(p3d) / 6.6) * sin(p3d.x / 2.0) * sin(p3d.y / 3.0));
	float ff = sin(time*0.3+fract(sum*0.88)*6.28);
	ff=pow(ff+0.2,1.5);
    vec3 col = vec3(ff);

	return col;
}

void main()	{
	vec2 p = vUv*2. -1.;
	vec3 col = GetCol(p);
	gl_FragColor = vec4(col ,1.0 );
}
`;

export {vertexShader2, fragmentShader2};