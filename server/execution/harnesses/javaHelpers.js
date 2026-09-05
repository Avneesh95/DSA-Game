/**
 * Fixed helper library embedded (verbatim) into every generated Java
 * harness. Provides a minimal JSON parser/stringifier (arrays, numbers,
 * strings, booleans, null — no objects needed, see signatureUtil.js) plus
 * conversion helpers between the parser's Object tree and the concrete
 * native types the 100 problems' signatures use.
 */
const JAVA_HELPERS = `
final class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

final class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

final class _Json {
    // ---------- Parsing ----------
    private final String s;
    private int i = 0;
    private _Json(String s) { this.s = s; }

    static Object parse(String text) {
        _Json p = new _Json(text.trim());
        return p.parseValue();
    }

    private void skipWs() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }

    private Object parseValue() {
        skipWs();
        char c = s.charAt(i);
        if (c == '[') return parseArray();
        if (c == '"') return parseString();
        if (c == 't') { i += 4; return Boolean.TRUE; }
        if (c == 'f') { i += 5; return Boolean.FALSE; }
        if (c == 'n') { i += 4; return null; }
        return parseNumber();
    }

    private List<Object> parseArray() {
        List<Object> out = new ArrayList<>();
        i++; // [
        skipWs();
        if (s.charAt(i) == ']') { i++; return out; }
        while (true) {
            out.add(parseValue());
            skipWs();
            if (s.charAt(i) == ',') { i++; continue; }
            if (s.charAt(i) == ']') { i++; break; }
            throw new RuntimeException("Malformed JSON array at " + i);
        }
        return out;
    }

    private String parseString() {
        StringBuilder sb = new StringBuilder();
        i++; // opening quote
        while (s.charAt(i) != '"') {
            char c = s.charAt(i);
            if (c == '\\\\') {
                i++;
                char esc = s.charAt(i);
                switch (esc) {
                    case 'n': sb.append('\\n'); break;
                    case 't': sb.append('\\t'); break;
                    case 'r': sb.append('\\r'); break;
                    case '"': sb.append('"'); break;
                    case '\\\\': sb.append('\\\\'); break;
                    case '/': sb.append('/'); break;
                    default: sb.append(esc);
                }
            } else {
                sb.append(c);
            }
            i++;
        }
        i++; // closing quote
        return sb.toString();
    }

    private Double parseNumber() {
        int start = i;
        while (i < s.length() && (Character.isDigit(s.charAt(i)) || s.charAt(i) == '-' || s.charAt(i) == '+' || s.charAt(i) == '.' || s.charAt(i) == 'e' || s.charAt(i) == 'E')) i++;
        return Double.parseDouble(s.substring(start, i));
    }

    // ---------- Stringifying ----------
    static String stringify(Object o) {
        StringBuilder sb = new StringBuilder();
        write(o, sb);
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private static void write(Object o, StringBuilder sb) {
        if (o == null) { sb.append("null"); return; }
        if (o instanceof String) {
            sb.append('"');
            for (char c : ((String) o).toCharArray()) {
                if (c == '"' || c == '\\\\') sb.append('\\\\');
                sb.append(c);
            }
            sb.append('"');
            return;
        }
        if (o instanceof Boolean) { sb.append(o.toString()); return; }
        if (o instanceof Double || o instanceof Float) {
            double d = ((Number) o).doubleValue();
            if (d == Math.floor(d) && !Double.isInfinite(d) && Math.abs(d) < 1e15) {
                sb.append((long) d);
            } else {
                sb.append(d);
            }
            return;
        }
        if (o instanceof Number) { sb.append(o.toString()); return; }
        if (o instanceof List) {
            sb.append('[');
            List<Object> list = (List<Object>) o;
            for (int idx = 0; idx < list.size(); idx++) {
                if (idx > 0) sb.append(',');
                write(list.get(idx), sb);
            }
            sb.append(']');
            return;
        }
        if (o instanceof int[]) {
            int[] arr = (int[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); sb.append(arr[idx]); }
            sb.append(']');
            return;
        }
        if (o instanceof long[]) {
            long[] arr = (long[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); sb.append(arr[idx]); }
            sb.append(']');
            return;
        }
        if (o instanceof double[]) {
            double[] arr = (double[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); write(arr[idx], sb); }
            sb.append(']');
            return;
        }
        if (o instanceof boolean[]) {
            boolean[] arr = (boolean[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); sb.append(arr[idx]); }
            sb.append(']');
            return;
        }
        if (o instanceof char[]) {
            char[] arr = (char[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); write(String.valueOf(arr[idx]), sb); }
            sb.append(']');
            return;
        }
        if (o instanceof Object[]) {
            Object[] arr = (Object[]) o;
            sb.append('[');
            for (int idx = 0; idx < arr.length; idx++) { if (idx > 0) sb.append(','); write(toJson(arr[idx]), sb); }
            sb.append(']');
            return;
        }
        sb.append("null");
    }

    // ---------- Object -> native conversions (parsing side) ----------
    @SuppressWarnings("unchecked")
    private static List<Object> asList(Object o) { return (List<Object>) o; }

    static int asInt(Object o) { return (int) Math.round((Double) o); }
    static long asLong(Object o) { return (long) Math.round((Double) o); }
    static double asDouble(Object o) { return (Double) o; }
    static float asFloat(Object o) { return ((Double) o).floatValue(); }
    static boolean asBool(Object o) { return (Boolean) o; }
    static char asChar(Object o) { String s = (String) o; return s.isEmpty() ? '\\0' : s.charAt(0); }
    static String asString(Object o) { return o == null ? null : (String) o; }

    static int[] asIntArr(Object o) {
        List<Object> l = asList(o);
        int[] out = new int[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asInt(l.get(idx));
        return out;
    }
    static int[][] asIntArr2(Object o) {
        List<Object> l = asList(o);
        int[][] out = new int[l.size()][];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asIntArr(l.get(idx));
        return out;
    }
    static long[] asLongArr(Object o) {
        List<Object> l = asList(o);
        long[] out = new long[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asLong(l.get(idx));
        return out;
    }
    static double[] asDoubleArr(Object o) {
        List<Object> l = asList(o);
        double[] out = new double[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asDouble(l.get(idx));
        return out;
    }
    static double[][] asDoubleArr2(Object o) {
        List<Object> l = asList(o);
        double[][] out = new double[l.size()][];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asDoubleArr(l.get(idx));
        return out;
    }
    static boolean[] asBoolArr(Object o) {
        List<Object> l = asList(o);
        boolean[] out = new boolean[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asBool(l.get(idx));
        return out;
    }
    static char[] asCharArr(Object o) {
        List<Object> l = asList(o);
        char[] out = new char[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asChar(l.get(idx));
        return out;
    }
    static char[][] asCharArr2(Object o) {
        List<Object> l = asList(o);
        char[][] out = new char[l.size()][];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asCharArr(l.get(idx));
        return out;
    }
    static String[] asStringArr(Object o) {
        List<Object> l = asList(o);
        String[] out = new String[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asString(l.get(idx));
        return out;
    }
    static String[][] asStringArr2(Object o) {
        List<Object> l = asList(o);
        String[][] out = new String[l.size()][];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = asStringArr(l.get(idx));
        return out;
    }
    static List<Integer> asListInt(Object o) {
        List<Object> l = asList(o);
        List<Integer> out = new ArrayList<>();
        for (Object x : l) out.add(asInt(x));
        return out;
    }
    static List<List<Integer>> asListListInt(Object o) {
        List<Object> l = asList(o);
        List<List<Integer>> out = new ArrayList<>();
        for (Object x : l) out.add(asListInt(x));
        return out;
    }
    static List<String> asListStr(Object o) {
        List<Object> l = asList(o);
        List<String> out = new ArrayList<>();
        for (Object x : l) out.add(asString(x));
        return out;
    }
    static List<List<String>> asListListStr(Object o) {
        List<Object> l = asList(o);
        List<List<String>> out = new ArrayList<>();
        for (Object x : l) out.add(asListStr(x));
        return out;
    }

    static ListNode buildListNode(Object o) {
        List<Object> l = asList(o);
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (Object x : l) { cur.next = new ListNode(asInt(x)); cur = cur.next; }
        return dummy.next;
    }
    static ListNode[] buildListNodeArr(Object o) {
        List<Object> l = asList(o);
        ListNode[] out = new ListNode[l.size()];
        for (int idx = 0; idx < l.size(); idx++) out[idx] = buildListNode(l.get(idx));
        return out;
    }
    static TreeNode buildTreeNode(Object o) {
        List<Object> l = asList(o);
        if (l.isEmpty() || l.get(0) == null) return null;
        TreeNode root = new TreeNode(asInt(l.get(0)));
        java.util.LinkedList<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        int idx = 1;
        while (!queue.isEmpty() && idx < l.size()) {
            TreeNode node = queue.poll();
            if (idx < l.size()) {
                Object v = l.get(idx++);
                if (v != null) { node.left = new TreeNode(asInt(v)); queue.add(node.left); }
            }
            if (idx < l.size()) {
                Object v = l.get(idx++);
                if (v != null) { node.right = new TreeNode(asInt(v)); queue.add(node.right); }
            }
        }
        return root;
    }
    static TreeNode findByValue(TreeNode root, int val) {
        if (root == null) return null;
        java.util.LinkedList<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) continue;
            if (node.val == val) return node;
            queue.add(node.left);
            queue.add(node.right);
        }
        return null;
    }

    // ---------- native -> Object (for stringify) ----------
    static Object toJson(int v) { return (double) v; }
    static Object toJson(long v) { return (double) v; }
    static Object toJson(double v) { return v; }
    static Object toJson(float v) { return (double) v; }
    static Object toJson(boolean v) { return v; }
    static Object toJson(char v) { return String.valueOf(v); }
    static Object toJson(String v) { return v; }
    static Object toJson(int[] v) { return v; }
    static Object toJson(long[] v) { return v; }
    static Object toJson(double[] v) { return v; }
    static Object toJson(boolean[] v) { return v; }
    static Object toJson(char[] v) { return v; }
    static Object toJson(int[][] v) { return v; }
    static Object toJson(double[][] v) { return v; }
    static Object toJson(char[][] v) { return v; }
    static Object toJson(String[] v) { return v; }
    static Object toJson(String[][] v) { return v; }
    static Object toJson(List<?> v) { return v; }
    static Object toJson(Object v) { return v; }
    static Object toJson(ListNode node) {
        List<Object> out = new ArrayList<>();
        int guard = 0;
        while (node != null && guard < 200000) { out.add((double) node.val); node = node.next; guard++; }
        return out;
    }
    static Object toJson(ListNode[] nodes) {
        List<Object> out = new ArrayList<>();
        for (ListNode n : nodes) out.add(toJson(n));
        return out;
    }
    static Object toJson(TreeNode root) {
        List<Object> out = new ArrayList<>();
        if (root == null) return out;
        java.util.LinkedList<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) { out.add(null); }
            else { out.add((double) node.val); queue.add(node.left); queue.add(node.right); }
        }
        while (!out.isEmpty() && out.get(out.size() - 1) == null) out.remove(out.size() - 1);
        return out;
    }
}
`;

module.exports = { JAVA_HELPERS };
