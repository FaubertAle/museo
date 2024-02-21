const homeFragment1 = `
#define MAX_ITER 4
void main( void ) {
    vec2 pos = 4.0 * (gl_FragCoord.xy / u_resolution.xy);

	
	for(int n=2; n < 20; n++){
		float i = float(n);
		
		pos += vec2(
			0.3 / i * sin(i * pos.y * i + u_time / 10.0 + 0.9 * i) + 0.5,
			0.3 / i * sin(i * pos.x * i + u_time / 10.0 + 0.9 * i) + 1.5
		);	
	}
	
	
	float r = 0.5 * cos(pos.x) + 0.6;
	float g = r * cos(pos.x) + 0.8;
    vec3 cl1 = vec3(.76, .02, .48);
    vec3 clf = mix(cl1, vec3(.8, .8, 1.), g);
	gl_FragColor = vec4(clf, 1.);
}
`;

const homeFragment2 = `
 
#define MAX_ITER 4
void main( void ) {
	vec2 sp = vUv;
	vec2 p = sp*4.0 - vec2(10.0);
	vec2 i = p;
	float c = 1.0;
	
	float inten = 0.01;
 
	for (int n = 0; n < MAX_ITER; n++) 
	{
		float t = 0.005*u_time* (11.0 - (3.0 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}
	c /= float(MAX_ITER);
	c = 1.5-sqrt(c);
	gl_FragColor = vec4(vec3(c*c*c*c), 999.0) + vec4(0.0, 0.3, 0.2, 1.0);
 
}

`;

const Backgrounds = [
    {
        glsl: homeFragment1
    },
    {
        glsl: homeFragment2
    }
];

export { Backgrounds}