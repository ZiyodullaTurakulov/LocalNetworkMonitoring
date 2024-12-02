<?php
header('Content-Type: application/json');

function getMacAddress($ip) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        exec("ping -n 1 " . escapeshellarg($ip), $ping_output, $ping_result);
        if ($ping_result == 0) {
            exec("arp -a " . escapeshellarg($ip), $arp_output);
            foreach ($arp_output as $line) {
                if (strpos($line, $ip) !== false) {
                    preg_match('/([0-9A-Fa-f]{2}-){5}([0-9A-Fa-f]{2})/', $line, $matches);
                    if (isset($matches[0])) {
                        return str_replace('-', ':', strtoupper($matches[0]));
                    }
                }
            }
        }
    } else {
        exec("ping -c 1 " . escapeshellarg($ip), $ping_output, $ping_result);
        if ($ping_result == 0) {
            exec("arp -n " . escapeshellarg($ip), $arp_output);
            foreach ($arp_output as $line) {
                if (strpos($line, $ip) !== false) {
                    preg_match('/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/', $line, $matches);
                    if (isset($matches[0])) {
                        return strtoupper($matches[0]);
                    }
                }
            }
        }
    }
    return false;
}

function getIpAddress($mac) {
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        exec("arp -a", $arp_output);
        foreach ($arp_output as $line) {
            if (stripos($line, str_replace(':', '-', $mac)) !== false) {
                preg_match('/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/', $line, $matches);
                if (isset($matches[1])) {
                    return $matches[1];
                }
            }
        }
    } else {
        exec("arp -n", $arp_output);
        foreach ($arp_output as $line) {
            if (stripos($line, $mac) !== false) {
                preg_match('/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/', $line, $matches);
                if (isset($matches[1])) {
                    return $matches[1];
                }
            }
        }
    }
    return false;
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action'])) {
    switch ($data['action']) {
        case 'detect_mac':
            if (isset($data['ip'])) {
                $mac = getMacAddress($data['ip']);
                if ($mac) {
                    echo json_encode(['success' => true, 'mac' => $mac]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'MAC manzil topilmadi']);
                }
            }
            break;
            
        case 'detect_ip':
            if (isset($data['mac'])) {
                $ip = getIpAddress($data['mac']);
                if ($ip) {
                    echo json_encode(['success' => true, 'ip' => $ip]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'IP manzil topilmadi']);
                }
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Noto\'g\'ri so\'rov']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'So\'rov parametrlari topilmadi']);
}