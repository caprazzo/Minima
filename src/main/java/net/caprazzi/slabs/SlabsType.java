package net.caprazzi.slabs;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface SlabsType {
	String value();
}
