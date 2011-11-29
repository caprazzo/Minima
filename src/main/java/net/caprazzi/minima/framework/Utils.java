package net.caprazzi.minima.framework;

import java.util.UUID;

public class Utils {

	public static String makeId() {
		return UUID.randomUUID().toString();
	}
}
