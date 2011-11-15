package net.caprazzi.slabs;

import java.lang.annotation.Annotation;


@SlabsType("fuzzo")
public class SampleDoc extends SlabsDoc {

	public static void main(String[] args) {
		SampleDoc sampleDoc = new SampleDoc();
		for (Annotation a : sampleDoc.getClass().getAnnotations()) {
			System.out.println(a);
		}
	}
	
}
