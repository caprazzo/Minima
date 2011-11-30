package net.caprazzi.slabs;


@SuppressWarnings("serial")
public final class SlabsException extends RuntimeException {
	public SlabsException(String msg, Exception ex) {
		super(msg, ex);
	}
	public SlabsException(Exception ex) {
		super(ex);
	}
}
